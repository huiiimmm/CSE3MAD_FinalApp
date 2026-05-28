import React from "react";

import "jest-styled-components";
import "jest-styled-components/native";

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";

import DirectoryScreen from "@/app/(tabs)/directory";
import { impactAsync } from "expo-haptics";
import { router } from "expo-router";

describe("<DirectoryScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<DirectoryScreen />);
  });

  /* ------------------------------------------------ */
  /* BUTTON NAVIGATION TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen when test 1 button is pressed", async () => {
    fireEvent.press(screen.getByTestId("test1"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/test1");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback when test1 button is pressed", async () => {
    fireEvent.press(screen.getByTestId("test1"));

    await waitFor(() => {
      expect(impactAsync).toHaveBeenCalledWith("Light");
    });
  });

  /* ------------------------------------------------ */
  /* SNAPSHOT TEST                                    */
  /* ------------------------------------------------ */

  test("matches snapshot", () => {
    const tree = render(<DirectoryScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
