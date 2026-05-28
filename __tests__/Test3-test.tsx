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

// ---------------- MOCKS ----------------

jest.useFakeTimers();

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
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

const mockSaveScore = jest.fn();

jest.mock("@/firebase", () => ({
  auth: {
    currentUser: {
      uid: "123",
      email: "test@test.com",
    },
  },

  saveScore: (...args: any[]) => mockSaveScore(...args),
}));

// ---------------- TESTS ----------------

describe("<Test3 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<Test3 />);
  });

  test("starts test when start button pressed", () => {
    fireEvent.press(screen.getByTestId("startButton"));

    expect(screen.getByText(/10/i)).toBeTruthy();
  });

  test("counts successful clicks", async () => {
    fireEvent.press(screen.getByText("Start Test"));

    const ball = await screen.findByTestId("ball");

    fireEvent.press(ball);

    expect(screen.getByText(/Clicks: 1/i)).toBeTruthy();
  });

  test("counts missed clicks", () => {
    fireEvent.press(screen.getByText("Start Test"));

    const miss = screen.getByTestId("background");

    fireEvent.press(miss);

    expect(screen.getByText(/Clicks: -1/i)).toBeTruthy();
  });

  test("shows accuracy correctly", async () => {
    fireEvent.press(screen.getByText("Start Test"));

    const ball = await screen.findByTestId("ball");

    fireEvent.press(ball);

    expect(screen.getByText(/Accuracy: 100.0%/i)).toBeTruthy();
  });

  test("ends test after timer", async () => {
    fireEvent.press(screen.getByTestId("startButton"));

    jest.advanceTimersByTime(10000);

    const nextTestButton = await screen.findByTestId("nextTest");
    await waitFor(() => {
      expect(nextTestButton).toBeTruthy();
    });
  });

  test("navigates to test4", async () => {
    fireEvent.press(screen.getByTestId("startButton"));

    jest.advanceTimersByTime(10000);

    const nextTestButton = await screen.findByTestId("nextTest");
    fireEvent.press(nextTestButton);

    expect(mockPush).toHaveBeenCalledWith("/test4");
  });

  test("Uploads score correctly", async () => {
    fireEvent.press(screen.getByTestId("startButton"));

    jest.advanceTimersByTime(10000);
    // check test stop
    const nextTestButton = await screen.findByTestId("nextTest");
    expect(nextTestButton).toBeTruthy;

    await waitFor(() => {
      expect(mockSaveScore).toHaveBeenCalled();
    });
    expect(mockSaveScore).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "123",
        email: "test@test.com",
      }),
      expect.objectContaining({
        testType: "test3",
        userId: "123",
        email: "test@test.com",
        score: expect.any(Number),
        timestamp: expect.any(Number),
      }),
    );
  });

  test("matches snapshot", () => {
    const tree = render(<Test3 />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
