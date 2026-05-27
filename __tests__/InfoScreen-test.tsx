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
    push: mockPush,
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
  /* RENDER TEST                                      */
  /* ------------------------------------------------ */

  test("renders InfoScreen correctly", () => {
    render(<InfoScreen />);

    expect(screen.getByText("Info Guide")).toBeTruthy();

    expect(screen.getByText("This is a reaction testing app.")).toBeTruthy();

    expect(screen.getByText("Start Test")).toBeTruthy();
  });

  /* ------------------------------------------------ */
  /* STYLE TEST                                       */
  /* ------------------------------------------------ */

  test("title has correct style", () => {
    render(<InfoScreen />);

    const title = screen.getByText("Info Guide");

    expect(title).toHaveStyle({
      color: "white",
      fontSize: 32,
      fontWeight: "bold",
    });
  });

  /* ------------------------------------------------ */
  /* CONTAINER TEST                                   */
  /* ------------------------------------------------ */

  test("container has correct background color", async () => {
    render(<InfoScreen />);

    const container = await screen.findByTestId("info");

    expect(container).toHaveStyle({
      backgroundColor: "#1e1e1e",
    });
  });

  /* ------------------------------------------------ */
  /* BUTTON NAVIGATION TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen when Start Test is pressed", async () => {
    render(<InfoScreen />);

    fireEvent.press(screen.getByText("Start Test"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/test1");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback when Start Test is pressed", async () => {
    render(<InfoScreen />);

    fireEvent.press(screen.getByText("Start Test"));

    await waitFor(() => {
      expect(mockImpactAsync).toHaveBeenCalledWith("Light");
    });
  });

  /* ------------------------------------------------ */
  /* FULL TEXT CONTENT TEST                           */
  /* ------------------------------------------------ */

  test("renders all instructions", () => {
    render(<InfoScreen />);

    expect(
      screen.getByText(/tap the screen with your dominant hand/i),
    ).toBeTruthy();

    expect(screen.getByText(/non-dominant hand/i)).toBeTruthy();

    expect(screen.getByText(/trace a moving object/i)).toBeTruthy();

    expect(screen.getByText(/yell into the mic/i)).toBeTruthy();
  });

  /* ------------------------------------------------ */
  /* SNAPSHOT TEST                                    */
  /* ------------------------------------------------ */

  test("matches snapshot", () => {
    const tree = render(<InfoScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
