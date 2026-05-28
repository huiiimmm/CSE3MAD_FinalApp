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

/* ------------------------------------------------ */
/* ROUTER MOCK                                      */
/* ------------------------------------------------ */

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
  },
}));

/* ------------------------------------------------ */
/* HAPTICS MOCK                                     */
/* ------------------------------------------------ */

const mockImpactAsync = jest.fn();

jest.mock("expo-haptics", () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),

  ImpactFeedbackStyle: {
    Light: "Light",
  },
}));

describe("<MenuScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ------------------------------------------------ */
  /* INFO BUTTON TEST                                 */
  /* ------------------------------------------------ */

  test("navigates to info screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("info"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("./info");
    });
  });

  /* ------------------------------------------------ */
  /* START TEST BUTTON TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("./test1");
    });
  });

  /* ------------------------------------------------ */
  /* LEADERBOARD BUTTON TEST                          */
  /* ------------------------------------------------ */

  test("navigates to results screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("leaderboard"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("./results");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByTestId("info"));

    await waitFor(() => {
      expect(mockImpactAsync).toHaveBeenCalledWith("Light");
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
