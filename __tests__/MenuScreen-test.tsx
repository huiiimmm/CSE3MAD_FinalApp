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

const pushMock = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: pushMock,
  },
}));

/* ------------------------------------------------ */
/* HAPTICS MOCK                                     */
/* ------------------------------------------------ */

const impactAsyncMock = jest.fn();

jest.mock("expo-haptics", () => ({
  impactAsync: (...args: any[]) => impactAsyncMock(...args),

  ImpactFeedbackStyle: {
    Light: "Light",
  },
}));

describe("<MenuScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ------------------------------------------------ */
  /* RENDER TEST                                      */
  /* ------------------------------------------------ */

  test("renders MenuScreen correctly", () => {
    render(<MenuScreen />);

    expect(screen.getByText("Reaction Tester")).toBeTruthy();

    expect(screen.getByText("Info")).toBeTruthy();

    expect(screen.getByText("Start Test")).toBeTruthy();

    expect(screen.getByText("Leaderboard")).toBeTruthy();
  });

  /* ------------------------------------------------ */
  /* STYLE TEST                                       */
  /* ------------------------------------------------ */

  test("title has correct style", () => {
    render(<MenuScreen />);

    const title = screen.getByText("Reaction Tester");

    expect(title).toHaveStyle({
      color: "white",
      fontSize: 36,
    });
  });

  /* ------------------------------------------------ */
  /* CONTAINER TEST                                   */
  /* ------------------------------------------------ */

  test("container has correct background color", async () => {
    render(<MenuScreen />);

    const container = await screen.findByTestId("menu");

    expect(container).toHaveStyle({
      backgroundColor: "#1e1e1e",
    });
  });

  /* ------------------------------------------------ */
  /* INFO BUTTON TEST                                 */
  /* ------------------------------------------------ */

  test("navigates to info screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByText("Info"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("./info");
    });
  });

  /* ------------------------------------------------ */
  /* START TEST BUTTON TEST                           */
  /* ------------------------------------------------ */

  test("navigates to test1 screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByText("Start Test"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("./test1");
    });
  });

  /* ------------------------------------------------ */
  /* LEADERBOARD BUTTON TEST                          */
  /* ------------------------------------------------ */

  test("navigates to results screen", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByText("Leaderboard"));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("./results");
    });
  });

  /* ------------------------------------------------ */
  /* HAPTIC TEST                                      */
  /* ------------------------------------------------ */

  test("triggers haptic feedback", async () => {
    render(<MenuScreen />);

    fireEvent.press(screen.getByText("Info"));

    await waitFor(() => {
      expect(impactAsyncMock).toHaveBeenCalledWith("Light");
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
