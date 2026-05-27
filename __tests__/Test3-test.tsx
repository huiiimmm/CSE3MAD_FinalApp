import "jest-styled-components";
import "jest-styled-components/native";

import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import React from "react";

import Test3 from "@/app/(tabs)/test3";
import { router } from "expo-router";
import { Pressable } from "react-native";

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

describe("<Test3 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders test3 screen correctly", () => {
    render(<Test3 />);

    expect(screen.getByTestId("test3")).toBeTruthy();

    expect(
      screen.getByText(/Click the moving ball as many times as you can/i),
    ).toBeTruthy();

    expect(screen.getByText(/Clicks: 0/i)).toBeTruthy();

    expect(screen.getByText(/Accuracy:/i)).toBeTruthy();

    expect(screen.getByText("Start Test")).toBeTruthy();
  });

  test("starts test when start button pressed", () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    expect(screen.getByText(/10/i)).toBeTruthy();
  });

  test("counts successful clicks", () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[1]);

    expect(screen.getByText(/Clicks: 1/i)).toBeTruthy();
  });

  test("counts missed clicks", () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[0]);

    expect(screen.getByText(/Clicks: -1/i)).toBeTruthy();
  });

  test("shows accuracy correctly", () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    const pressables = screen.UNSAFE_getAllByType(Pressable);

    fireEvent.press(pressables[1]);

    expect(screen.getByText(/Accuracy: 100.0%/i)).toBeTruthy();
  });

  test("ends test after timer", async () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByText("Test 4")).toBeTruthy();
    });
  });

  test("navigates to test4", async () => {
    render(<Test3 />);

    fireEvent.press(screen.getByText("Start Test"));

    jest.advanceTimersByTime(10000);

    await waitFor(() => {
      fireEvent.press(screen.getByText("Test 4"));
    });

    expect(router.push).toHaveBeenCalledWith("/test4");
  });

  test("matches snapshot", () => {
    const tree = render(<Test3 />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
