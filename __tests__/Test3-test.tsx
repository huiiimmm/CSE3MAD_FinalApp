import Test3 from "@/app/(tabs)/ReactionTest/test3";
import { auth, saveReactionScore } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";

describe("Reaction Test 3 Tracking Fluidity Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Establish standard mock user profiles
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "tracking-tester-id", email: "fluid_motion@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const triggerLayout = (component: any, width = 400, height = 600) => {
    const canvas = component.getByTestId("background").parent;
    fireEvent(canvas, "layout", {
      nativeEvent: { layout: { width, height } },
    });
  };

  it("renders the onboarding introduction state layout prior to physics launch", () => {
    const component = render(<Test3 />);

    expect(component.getByText("Test 3 - Tracking Fluidity")).toBeTruthy();
    expect(component.getByText("Hits: 0")).toBeTruthy();
    expect(component.getByText("Accuracy: 0.0%")).toBeTruthy();
    expect(component.getByTestId("startButton")).toBeTruthy();
  });

  it("drives the countdown clock down, tracks accurate hits/misses, and uploads telemetry structures", async () => {
    // Lock down random calculation factors to ensure deterministic test runs
    jest.spyOn(Math, "random").mockReturnValue(0.4); // speed calculation modifier

    const component = render(<Test3 />);

    // 1. Fire onLayout to configure the running physics dimension matrices
    triggerLayout(component, 400, 800);

    // 2. Launch the dynamic gaming engine canvas
    const startButton = component.getByTestId("startButton");
    await act(async () => {
      fireEvent.press(startButton);
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium,
    );
    expect(component.getByText("Timer: 10s")).toBeTruthy();

    // 3. Register a successful pinpoint hit on the active moving target node
    const targetBall = component.getByTestId("ball");
    await act(async () => {
      fireEvent.press(targetBall);
    });

    expect(component.getByText("Hits: 1")).toBeTruthy();
    expect(component.getByText("Accuracy: 100.0%")).toBeTruthy();

    // 4. Register a miss by clicking anywhere on the background container grid
    const backgroundCanvas = component.getByTestId("background");
    await act(async () => {
      fireEvent.press(backgroundCanvas);
    });

    // Score calculations drop: Hits: 1 - 1 = 0. Accuracy: 0 / 2 = 0.0%
    expect(component.getByText("Hits: 0")).toBeTruthy();
    expect(component.getByText("Accuracy: 0.0%")).toBeTruthy();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Error,
    );

    // Add 2 clean hits to create positive end results
    await act(async () => {
      fireEvent.press(targetBall);
      fireEvent.press(targetBall);
    });
    // Final state values should equal 2 Hits out of 4 Total Clicks (50.0%)

    // 5. Run the countdown interval wheels down to 0 to trigger game completion
    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    // CORRECTION: The component actually retains startTest=true, meaning "Timer: 0s" is still visible!
    expect(component.queryByText("Timer: 0s")).toBeTruthy();
    expect(component.queryByText("Timer: 10s")).toBeNull(); // 10s layout state is safely verified as destroyed

    // Verify completion metrics display
    expect(component.getByText("2 Point Hits")).toBeTruthy();
    expect(
      component.getByText(
        "Maintained an overall pinpoint accuracy metric of 50.0%.",
      ),
    ).toBeTruthy();
    // 6. Assert Firebase transaction parameters match collected aggregates exactly
    await waitFor(() => {
      expect(saveReactionScore).toHaveBeenCalledWith(
        { uid: "tracking-tester-id", email: "fluid_motion@test.com" },
        expect.objectContaining({
          testType: "test3",
          userId: "tracking-tester-id",
          reactionScore: 2,
        }),
      );
    });

    // 7. Test navigational next action button routers
    const nextTestButton = component.getByTestId("nextTest");
    await act(async () => {
      fireEvent.press(nextTestButton);
    });
    expect(router.push).toHaveBeenCalledWith("/(tabs)/ReactionTest/test4");
  });

  it("handles physics position transformations seamlessly inside 16ms refresh interval ticks", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // Fixed direction/speed bounds

    const component = render(<Test3 />);
    triggerLayout(component, 500, 500);

    const startButton = component.getByTestId("startButton");
    await act(async () => {
      fireEvent.press(startButton);
    });

    // Advance by single physics engine processing frames (16ms refresh window)
    await act(async () => {
      jest.advanceTimersByTime(16);
    });

    // Confirms it runs through internal boundary validation code without structural failures
    expect(component.getByTestId("ball")).toBeTruthy();
  });
});
