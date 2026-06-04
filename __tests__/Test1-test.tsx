import Test1 from "@/app/(tabs)/ReactionTest/test1";
import { auth, saveReactionScore } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";

describe("Reaction Test 1 Dominant Hand Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Set up standard user environment metrics tracking anchors
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "reaction-user-id", email: "neuro_speed@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the onboarding splash layout cleanly prior to kicking off tests", () => {
    const { getByText, getByTestId } = render(<Test1 />);

    expect(getByText("Test 1 - Dominant Hand")).toBeTruthy();
    expect(getByTestId("startButton")).toBeTruthy();
  });

  it("intercepts early taps and forces a fail layout change state if the user clicks prematurely", async () => {
    const { getByTestId, getByText, queryByTestId } = render(<Test1 />);

    const startButton = getByTestId("startButton");
    await act(async () => {
      fireEvent.press(startButton);
    });

    // Verify early check interceptor layer loads immediately during the hidden delay period
    const earlyCheckOverlay = getByTestId("earlyCheck");
    expect(earlyCheckOverlay).toBeTruthy();

    // Simulate clicking the overlay layout before the random timer resolves
    await act(async () => {
      fireEvent.press(earlyCheckOverlay);
    });

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Error,
    );
    expect(getByText("Too Early!")).toBeTruthy();
    expect(queryByTestId("earlyCheck")).toBeNull();

    // Verify reset configuration path execution flow works cleanly
    const tryAgainButton = getByTestId("restartButton");
    await act(async () => {
      fireEvent.press(tryAgainButton);
    });

    expect(getByText("Test 1 - Dominant Hand")).toBeTruthy();
  });
  it("calculates elapsed milestones accurately, captures response inputs, and posts logs to cloud storage", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);

    const { getByTestId, getByText } = render(<Test1 />);

    const startButton = getByTestId("startButton");
    await act(async () => {
      fireEvent.press(startButton);
    });

    // Setup time virtualization parameters *before* hitting the green screen threshold
    const baselineTime = 1718234000000;
    let simulatedElapsedTime = 0;

    const timeSpy = jest.spyOn(Date, "now").mockImplementation(() => {
      return baselineTime + simulatedElapsedTime;
    });

    // Bring the app right to the edge of the green screen trigger
    await act(async () => {
      jest.advanceTimersByTime(6000);
    });

    expect(getByText("TAP NOW!")).toBeTruthy();
    const hitOverlay = getByTestId("reactionScreen");

    // Advance time safely, allowing the interval inside startTimer() to run
    await act(async () => {
      simulatedElapsedTime = 240;
      jest.advanceTimersByTime(240);
    });

    // Press the overlay layout interaction interceptor shell
    await act(async () => {
      fireEvent.press(hitOverlay);
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Heavy,
    );

    // Assert calculated performance data synced to down to cloud registers
    await waitFor(() => {
      expect(getByTestId("finalScore")).toBeTruthy();
      expect(saveReactionScore).toHaveBeenCalledWith(
        { uid: "reaction-user-id", email: "neuro_speed@test.com" },
        expect.objectContaining({
          testType: "test1",
          userId: "reaction-user-id",
          reactionScore: 240,
        }),
      );
    });

    // Verify navigation pathways route perfectly
    const proceedButton = getByTestId("nextTest");
    await act(async () => {
      fireEvent.press(proceedButton);
    });
    expect(router.push).toHaveBeenCalledWith("/(tabs)/ReactionTest/test2");

    // Restore global clock structures safely
    timeSpy.mockRestore();
  });
});
