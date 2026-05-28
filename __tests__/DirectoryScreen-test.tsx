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
      expect(mockPush).toHaveBeenCalledWith("/test1");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback when test1 button is pressed", async () => {
    fireEvent.press(screen.getByTestId("test1"));

    await waitFor(() => {
      expect(mockImpactAsync).toHaveBeenCalledWith("Light");
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
