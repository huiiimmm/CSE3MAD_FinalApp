import Test4 from "@/app/(tabs)/ReactionTest/test4";
import { auth, saveReactionScore } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";

describe("Reaction Test 4 Audio Cue Suite", () => {
  let mockRecording: any;
  let mockSound: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Grab instance references from our mock setup to alter tracking values on-the-fly
    mockSound = new Audio.Sound();
    mockRecording = new Audio.Recording();

    // Setup standard user environment state hooks
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "acoustic-user-id", email: "audio_speed@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders onboarding instructions initially without starting active timers", () => {
    const { getByText } = render(<Test4 />);

    expect(getByText("Test 4 - Audio Cue Reaction")).toBeTruthy();
    expect(getByText("Initialize Test")).toBeTruthy();
  });

  it("runs the full game loop tracking decibel mic triggers and firing database sync loops", async () => {
    // 1. Clamp random seed timers cleanly to 5000ms delay bounds
    jest.spyOn(Math, "random").mockReturnValue(0.375); // 0.375 * 8000 + 2000 = 5000ms

    const { getByText, queryByText } = render(<Test4 />);

    const initButton = getByText("Initialize Test");
    await act(async () => {
      fireEvent.press(initButton);
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium,
    );
    expect(getByText("LISTENING FOR INPUT ACCELERATION...")).toBeTruthy();

    // 2. Setup virtualization timeline arrays to intercept hardware clock steps
    const baselineTime = 1718234000000;
    let simulatedElapsedTime = 0;
    jest
      .spyOn(Date, "now")
      .mockImplementation(() => baselineTime + simulatedElapsedTime);

    // 3. Complete the random silence countdown to sound the trigger beep tone
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    // Confirm that the sound asset ran its replay execution loop safely
    const createdSound = await Audio.Sound.createAsync(
      require("@/features/audio/beep-07a.mp3"),
      { shouldPlay: false, volume: 1.0 },
    );
    expect(createdSound.sound.replayAsync).toHaveBeenCalled();

    // 4. Advance clock by 160ms. The mic is polling every 80ms, but still registering as quiet (-60dB)
    await act(async () => {
      simulatedElapsedTime = 160;
      jest.advanceTimersByTime(160);
    });

    expect(getByText("160 ms")).toBeTruthy();

    // 5. Simulate the user shouting or snapping fingers (clamping metering threshold to -10dB)
    mockRecording.getStatusAsync.mockResolvedValueOnce({ metering: -10 });

    // Step clock forward past the next 80ms hardware loop threshold
    await act(async () => {
      simulatedElapsedTime = 240;
      jest.advanceTimersByTime(80);
    });

    // 6. Verify processing thread flags closed down accurately
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Heavy,
    );
    expect(mockRecording.stopAndUnloadAsync).toHaveBeenCalled();
    expect(queryByText("LISTENING FOR INPUT ACCELERATION...")).toBeNull();

    // 7. Test final score metric card rendering and structural firebase payloads
    expect(getByText("240 ms")).toBeTruthy();
    await waitFor(() => {
      expect(saveReactionScore).toHaveBeenCalledWith(
        { uid: "acoustic-user-id", email: "audio_speed@test.com" },
        expect.objectContaining({
          testType: "test4",
          userId: "acoustic-user-id",
          reactionScore: 240,
        }),
      );
    });

    // 8. Test Navigation Redirection Pathway Action Routes
    const dashboardBtn = getByText("View Leaderboards");
    await act(async () => {
      fireEvent.press(dashboardBtn);
    });
    expect(router.push).toHaveBeenCalledWith("/(tabs)/ReactionTest/results");
  });
});
