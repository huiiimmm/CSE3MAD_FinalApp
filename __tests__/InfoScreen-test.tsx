import React from "react";

import "jest-styled-components";
import "jest-styled-components/native";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import InfoScreen from "@/app/(tabs)/info";
import { impactAsync } from "expo-haptics";
import { router } from "expo-router";

describe("<InfoScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<InfoScreen />);
  });

  /* ------------------------------------------------ */
  /* BUTTON NAVIGATION TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen when Start Test is pressed", async () => {
    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("/test1");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback when Start Test is pressed", async () => {
    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(impactAsync).toHaveBeenCalledWith("Light");
    });
  });

  /* ------------------------------------------------ */
  /* SNAPSHOT TEST                                    */
  /* ------------------------------------------------ */

  test("matches snapshot", () => {
    const tree = render(<InfoScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
