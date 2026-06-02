import EarthquakeSimulator from "@/app/(tabs)/EarthquakeResistance/earthquake_simulator";
import { auth, uploadEarthquakeData } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Accelerometer, Gyroscope } from "expo-sensors";
import React from "react";
import { Vibration } from "react-native";

describe("EarthquakeSimulator Sensor Fusion Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    Object.defineProperty(auth, "currentUser", {
      value: { uid: "test-fusion-id", email: "seismic_fusion@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the initial telemetry view accurately before engaging physical hardware", () => {
    const { getByText, getByPlaceholderText } = render(<EarthquakeSimulator />);

    expect(getByText("Seismic Fusion Simulator")).toBeTruthy();
    expect(getByPlaceholderText("Enter structure name")).toBeTruthy();
    expect(getByText("Linear Acceleration: 0.0000 G")).toBeTruthy();
    expect(getByText("Angular Rotation: 0.0000 rad/s")).toBeTruthy();
    expect(getByText("Time Remaining: 15s")).toBeTruthy();
  });

  it("enforces validation rules and blocks execution if the structure name string is blank", async () => {
    const { getByText } = render(<EarthquakeSimulator />);
    const actionButton = getByText("Start Sensor Fusion Test");

    // Wrapped fireEvent since it sets validation error states
    await act(async () => {
      fireEvent.press(actionButton);
    });

    await waitFor(() => {
      expect(
        getByText("Please define a structure name before beginning."),
      ).toBeTruthy();
      expect(Accelerometer.addListener).not.toHaveBeenCalled();
      expect(Gyroscope.addListener).not.toHaveBeenCalled();
    });
  });

  it("manages the 15-second simulation lifecycle, fires haptic cues, and uploads sensor data logs", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <EarthquakeSimulator />,
    );

    // 1. Enter contextual data profile
    const nameInput = getByPlaceholderText("Enter structure name");
    await act(async () => {
      fireEvent.changeText(nameInput, "Skyscraper Concrete Core");
    });

    // 2. Start Simulation Loop Engine (Wrapped inside act due to multiple hook mutations)
    const actionButton = getByText("Start Sensor Fusion Test");
    await act(async () => {
      fireEvent.press(actionButton);
    });

    // Verify initial layout changes and hardware side-effects
    expect(Accelerometer.addListener).toHaveBeenCalled();
    expect(Gyroscope.addListener).toHaveBeenCalled();
    expect(Vibration.vibrate).toHaveBeenCalledWith([0, 1000, 150, 400]);
    expect(getByText("Restart Test")).toBeTruthy();

    // 3. Emit synthetic physical movement frames through active hardware layers
    await act(async () => {
      (Accelerometer as any).mockEmit({ x: 0.5, y: 0.8, z: 0.5 });
      (Gyroscope as any).mockEmit({ x: 0.1, y: 0.2, z: 0.1 });
    });

    // Check UI text node changes post-emission
    expect(getByText("Linear Acceleration: 0.0677 G")).toBeTruthy();
    expect(getByText("Angular Rotation: 0.2449 rad/s")).toBeTruthy();

    // 4. Advance through the full 15-second countdown step block
    for (let i = 0; i < 15; i++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    }

    // 5. Verify absolute teardown sequences and successful database updates
    await waitFor(() => {
      expect(getByTestId("Simulation Completed!")).toBeTruthy();
      expect(
        getByText("Sensor Fusion telemetry logged successfully!"),
      ).toBeTruthy();

      expect(uploadEarthquakeData).toHaveBeenCalledWith(
        { uid: "test-fusion-id", email: "seismic_fusion@test.com" },
        "Skyscraper Concrete Core",
        0.3126,
        0.3126,
      );
    });

    expect(getByText("Review Combined Analytics")).toBeTruthy();
  });
});
