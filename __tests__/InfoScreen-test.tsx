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

describe("<InfoScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ------------------------------------------------ */
  /* BUTTON NAVIGATION TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen when Start Test is pressed", async () => {
    render(<InfoScreen />);

    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/test1");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback when Start Test is pressed", async () => {
    render(<InfoScreen />);

    fireEvent.press(screen.getByTestId("startTest"));

    await waitFor(() => {
      expect(mockImpactAsync).toHaveBeenCalledWith("Light");
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
