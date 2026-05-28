import React from "react";

import "jest-styled-components";
import "jest-styled-components/native";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import MenuScreen from "@/app/(tabs)/menu";
import { impactAsync } from "expo-haptics";
import { router } from "expo-router";

describe("<MenuScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<MenuScreen />);
  });

  /* ------------------------------------------------ */
  /* INFO BUTTON TEST                                 */
  /* ------------------------------------------------ */

  test("navigates to info screen", async () => {
    fireEvent.press(screen.getByTestId("info"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("./info");
    });
  });

  /* ------------------------------------------------ */
  /* START TEST BUTTON TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen", async () => {
    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("./test1");
    });
  });

  /* ------------------------------------------------ */
  /* LEADERBOARD BUTTON TEST                          */
  /* ------------------------------------------------ */

  test("navigates to results screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("leaderboard"));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith("./results");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("info"));

    await waitFor(() => {
      expect(impactAsync).toHaveBeenCalledWith("Light");
    });
  });

  /* ------------------------------------------------ */
  /* SNAPSHOT TEST                                    */
  /* ------------------------------------------------ */

  test("matches snapshot", () => {
    const tree = render(<MenuScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
