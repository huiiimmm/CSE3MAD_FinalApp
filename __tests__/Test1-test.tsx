import "jest-styled-components";
import "jest-styled-components/native";

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";

import Test1 from "@/app/(tabs)/test1";

// ---------------- MOCKS ----------------

jest.useFakeTimers();

jest.spyOn(Math, "random").mockReturnValue(0);

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
  },
}));

const mockImpactAsync = jest.fn();

jest.mock("expo-haptics", () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),

  ImpactFeedbackStyle: {
    Medium: "Medium",
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

describe("<Test1 />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    render(<Test1 />);
  });

  test("uploads score after successful reaction", async () => {
    (mockSaveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });

    await waitFor(() => {
      expect(mockSaveScore).toHaveBeenCalled();
    });
    expect(mockSaveScore).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "123",
        email: "test@test.com",
      }),
      expect.objectContaining({
        testType: "test1",
        userId: "123",
        email: "test@test.com",
        score: expect.any(Number),
        timestamp: expect.any(Number),
      }),
    );
  });

  test("navigates to test2", async () => {
    (mockSaveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });
    const nextTestButton = await screen.findByTestId("nextTest");
    fireEvent.press(nextTestButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/test2");
    });
  });

  test("haptics on reaction", async () => {
    (mockSaveScore as jest.Mock).mockResolvedValue(undefined);

    act(() => {
      fireEvent.press(screen.getByTestId("startButton"));
    });

    jest.advanceTimersByTime(2000);

    const reactionScreen = await screen.findByTestId("reactionScreen");

    act(() => {
      fireEvent.press(reactionScreen);
    });
    await waitFor(() => {
      expect(mockImpactAsync).toHaveBeenCalledWith("Medium");
    });
  });

  test("matches snapshot", () => {
    const tree = render(<Test1 />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
