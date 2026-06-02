import SoundPollutionTest from "@/app/(tabs)/SoundPollution/pollution_test";
import { auth, uploadSoundLocation } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { router } from "expo-router";
import React from "react";

describe("SoundPollutionTest Telemetry Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset default authenticated user state profile
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "test-audio-uid", email: "acoustic_tester@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the default monitoring layout correctly when authorized", () => {
    const { getByText, getByPlaceholderText } = render(<SoundPollutionTest />);

    expect(getByText("Sound Pollution Test")).toBeTruthy();
    expect(
      getByPlaceholderText("e.g., Traffic, Construction, Train, Cafe"),
    ).toBeTruthy();
    expect(getByText("Start Monitoring")).toBeTruthy();
    expect(getByText("--")).toBeTruthy();
  });

  it("fails validation if attempting an upload loop with an empty noise description input", async () => {
    const { getByText } = render(<SoundPollutionTest />);
    const submitButton = getByText("Tag Current Location");

    await act(async () => {
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(
        getByText("Upload failed. Please ensure description isn't blank."),
      ).toBeTruthy();
      expect(Location.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  it("spins up hardware loops, updates decibel labels dynamically, and handles upload pipelines", async () => {
    const { getByText, getByPlaceholderText } = render(<SoundPollutionTest />);

    // 1. Describe sound source signature
    const input = getByPlaceholderText(
      "e.g., Traffic, Construction, Train, Cafe",
    );
    await act(async () => {
      fireEvent.changeText(input, "Heavy Freight Train");
    });

    // 2. Fire up microphone input hardware monitoring thread
    const monitorButton = getByText("Start Monitoring");
    await act(async () => {
      fireEvent.press(monitorButton);
    });

    expect(Audio.requestPermissionsAsync).toHaveBeenCalled();
    expect(Audio.setAudioModeAsync).toHaveBeenCalled();
    expect(Audio.Recording.createAsync).toHaveBeenCalled();
    expect(getByText("Stop Monitoring")).toBeTruthy();

    // 3. Fast-forward virtual timer wheels to trigger the meterInterval loop step
    await act(async () => {
      // Base mock calculation: -35 (metering value) + 100 = 65 dB
      jest.advanceTimersByTime(50);
    });

    expect(getByText("65 dB")).toBeTruthy();
    expect(getByText("Moderate Noise")).toBeTruthy();

    // 4. Fire the complete location tagging telemetry execution pipeline
    const tagButton = getByText("Tag Current Location");
    await act(async () => {
      fireEvent.press(tagButton);
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();

    await waitFor(() => {
      expect(uploadSoundLocation).toHaveBeenCalledWith(
        { uid: "test-audio-uid", email: "acoustic_tester@test.com" },
        { latitude: -37.8136, longitude: 144.9631 },
        "Heavy Freight Train",
        65,
      );
      expect(
        getByText("Sound metrics and GPS coordinates mapped successfully!"),
      ).toBeTruthy();
    });
  });

  it("unmounts hardware gracefully and navigates to the visual map representation board", async () => {
    const { getByText } = render(<SoundPollutionTest />);
    const mapButton = getByText("Open Live Sound Map");

    // Prime the monitoring engine to verify it clears itself during transition splits
    const monitorButton = getByText("Start Monitoring");
    await act(async () => {
      fireEvent.press(monitorButton);
    });

    await act(async () => {
      fireEvent.press(mapButton);
    });

    // Verify it kills active decibel poll loops cleanly before routing out
    expect(getByText("Start Monitoring")).toBeTruthy();
    expect(router.push).toHaveBeenCalledWith("/SoundPollution/sound_map");
  });

  it("blocks user interface access paths gracefully if auth credentials default to null status", () => {
    Object.defineProperty(auth, "currentUser", {
      value: null,
      configurable: true,
      writable: true,
    });

    const { getByText, queryByText } = render(<SoundPollutionTest />);

    expect(getByText("Please log in to start the simulation.")).toBeTruthy();
    expect(queryByText("Sound Pollution Test")).toBeNull();
  });
});
