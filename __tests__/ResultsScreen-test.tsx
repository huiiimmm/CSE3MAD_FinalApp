import "jest-styled-components";
import "jest-styled-components/native";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import ResultsScreen from "@/app/(tabs)/results";
import { router } from "expo-router";

// ---------------- TESTS ----------------

describe("<ResultsScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders leaderboard users", async () => {
    render(<ResultsScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("current@test.com")).toBeTruthy();

      expect(screen.getAllByText("other@test.com")).toBeTruthy();
    });
  });

  test("renders scores correctly", async () => {
    render(<ResultsScreen />);

    await waitFor(() => {
      expect(screen.getAllByText(/120 ms/)).toBeTruthy();

      expect(screen.getAllByText(/25 clicks/)).toBeTruthy();
    });
  });

  test("navigates back to menu", () => {
    render(<ResultsScreen />);

    const button = screen.getByTestId("menu");

    fireEvent.press(button);

    expect(router.push).toHaveBeenCalledWith("/menu");
  });

  test("navigates to change user", () => {
    render(<ResultsScreen />);

    const button = screen.getByTestId("changeUser");

    fireEvent.press(button);

    expect(router.push).toHaveBeenCalledWith("/(tabs)");
  });

  test("matches snapshot", () => {
    const tree = render(<ResultsScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
