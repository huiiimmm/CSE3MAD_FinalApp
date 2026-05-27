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

// ---------------- MOCKS ----------------

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
    },
  },

  getLeaderboardDocs: jest.fn(
    (testName: string, setState: (data: any[]) => void, fastest: boolean) => {
      const mockData = [
        {
          id: `${testName}-1`,
          userId: "123",
          email: "current@test.com",
          score: fastest ? 120 : 25,
        },
        {
          id: `${testName}-2`,
          userId: "456",
          email: "other@test.com",
          score: fastest ? 180 : 18,
        },
      ];

      setState(mockData);
    },
  ),
}));

// ---------------- TESTS ----------------

describe("<ResultsScreen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders results screen correctly", () => {
    render(<ResultsScreen />);

    expect(screen.getByTestId("results")).toBeTruthy();

    expect(screen.getByText("Leaderboards")).toBeTruthy();

    expect(screen.getByText("Test 1 - Dominant Hand")).toBeTruthy();

    expect(screen.getByText("Test 2 - Non Dominant Hand")).toBeTruthy();

    expect(screen.getByText("Test 3 - Tracking")).toBeTruthy();

    expect(screen.getByText("Test 4 - Audio Reaction")).toBeTruthy();
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

    const button = screen.getByText("Back To Menu");

    fireEvent.press(button);

    expect(router.push).toHaveBeenCalledWith("./menu");
  });

  test("navigates to change user", () => {
    render(<ResultsScreen />);

    const button = screen.getByText("Change User");

    fireEvent.press(button);

    expect(router.push).toHaveBeenCalledWith("/(tabs)");
  });

  test("matches snapshot", () => {
    const tree = render(<ResultsScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
