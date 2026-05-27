import "jest-styled-components";
import "jest-styled-components/native";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { View } from "react-native";

import Test1 from "@/app/(tabs)/test1";
import { router } from "expo-router";

// ---------------- MOCKS ----------------

jest.useFakeTimers();

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "Light",
    Medium: "Medium",
  },
  NotificationFeedbackType: {
    Error: "Error",
  },
}));

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
      email: "test@test.com",
    },
  },

  saveScore: jest.fn(),
}));

// ---------------- TESTS ----------------

describe("<Test1 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders test1 screen correctly", () => {
    render(<Test1 />);

    expect(screen.getByTestId("test1")).toBeTruthy();

    expect(screen.getByText("Test 1 - Dominant Hand")).toBeTruthy();

    expect(screen.getByText("Tap as soon as you see green")).toBeTruthy();

    expect(screen.getByText("Start")).toBeTruthy();
  });

  test("starts the test when start button pressed", () => {
    render(<Test1 />);

    const startButton = screen.getByText("Start");

    fireEvent.press(startButton);

    expect(screen.getByText(/0ms/i)).toBeTruthy();
  });

  test("shows too early message if pressed early", async () => {
    render(<Test1 />);

    const startButton = screen.getByText("Start");

    fireEvent.press(startButton);

    fireEvent.press(screen.getByTestId("earlyCheck"));

    await waitFor(() => {
      expect(screen.getByText("Too early!")).toBeTruthy();

      expect(screen.getByTestId("restartButton")).toBeTruthy();
    });
  });

  test("restart button resets test", async () => {
    render(<Test1 />);

    fireEvent.press(screen.getByTestId("startButton"));

    fireEvent.press(screen.getByTestId("earlyCheck"));

    fireEvent.press(screen.getByTestId("restartButton"));
    await waitFor(() => {
      expect(screen.getByTestId("startButton")).toBeTruthy();
    });
  });

  test("shows next test after successful reaction", async () => {
    jest.useFakeTimers();
    render(<Test1 />);

    fireEvent.press(screen.getByText("Start"));

    await waitFor(() => {
      fireEvent.press(screen.getByTestId("reactionScreen"));
    });

    expect(screen.getByText("Next Test")).toBeTruthy();
  });

  test("navigates to test2", async () => {
    render(<Test1 />);

    fireEvent.press(screen.getByText("Start"));

    jest.useFakeTimers();

    await waitFor(() => {
      const overlays = screen.UNSAFE_getAllByType(View);

      fireEvent.press(overlays[0]);
    });

    fireEvent.press(screen.getByText("Next Test"));

    expect(router.push).toHaveBeenCalledWith("/test2");
  });

  test("matches snapshot", () => {
    const tree = render(<Test1 />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
