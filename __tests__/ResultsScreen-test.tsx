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

// ---------------- MOCKS ----------------

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
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

    expect(mockPush).toHaveBeenCalledWith("/menu");
  });

  test("navigates to change user", () => {
    render(<ResultsScreen />);

    const button = screen.getByTestId("changeUser");

    fireEvent.press(button);

    expect(mockPush).toHaveBeenCalledWith("/(tabs)");
  });

  test("matches snapshot", () => {
    const tree = render(<ResultsScreen />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
