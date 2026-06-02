import StretchTest from "@/app/(tabs)/StretchTest/stretch_test";
import { auth, uploadVibrationData } from "@/firebase";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import React from "react";
import { Vibration } from "react-native";

describe("StretchTest Hardware Integration Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Seed default authenticated developer user state profile
    Object.defineProperty(auth, "currentUser", {
      value: { uid: "test-stretch-uid", email: "material_science@test.com" },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the baseline hardware display components on initial load", () => {
    const { getByText, getByPlaceholderText } = render(<StretchTest />);

    expect(getByText("Stretch Test")).toBeTruthy();
    expect(getByPlaceholderText("Enter stretch type")).toBeTruthy();
    expect(getByText("Sensors Stopped")).toBeTruthy();
    expect(Accelerometer.setUpdateInterval).toHaveBeenCalledWith(16);
  });

  it("blocks test initiation with a descriptive validation string if stretch profile type is empty", async () => {
    const { getByText } = render(<StretchTest />);
    const recordButton = getByText("Start Recording");

    await act(async () => {
      fireEvent.press(recordButton);
    });

    expect(
      getByText("Please define a stretch type before beginning."),
    ).toBeTruthy();
    expect(Accelerometer.addListener).not.toHaveBeenCalled();
    expect(Vibration.vibrate).not.toHaveBeenCalled();
  });

  it("manages hardware lifecycles, computes dynamic forces, advances heartbeat loops, and posts metrics", async () => {
    const { getByText, getByPlaceholderText } = render(<StretchTest />);

    // 1. Enter text data category
    const input = getByPlaceholderText("Enter stretch type");
    await act(async () => {
      fireEvent.changeText(input, "Tensile Concrete Grid");
    });

    // 2. Click button to fire up peripheral monitoring engines
    const recordButton = getByText("Start Recording");
    await act(async () => {
      fireEvent.press(recordButton);
    });

    // Verify initial haptic pulse and subscriber attachments
    expect(Vibration.vibrate).toHaveBeenNthCalledWith(1, 10000);
    expect(Accelerometer.addListener).toHaveBeenCalled();
    expect(getByText("Stop Recording")).toBeTruthy();

    // 3. Fast forward timers to evaluate the background haptic hum refresh interval loop
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(Vibration.vibrate).toHaveBeenNthCalledWith(2, 10000);

    // 4. Send a mock hardware update package through the hardware listener layer
    // Math: totalForce = sqrt(0.6^2 + 0.8^2 + 0.0^2) = 1.0G
    // dynamicVibration = abs(1.0 - 1.0) = 0 (Below noise threshold, falls back to 0)
    await act(async () => {
      (Accelerometer as any).mockEmit({ x: 0.6, y: 0.8, z: 0.0 });
    });
    expect(getByText("Current Force: 0.000 G")).toBeTruthy();

    // Send a high intensity impact signature
    // Math: totalForce = sqrt(0.0^2 + 1.5^2 + 2.0^2) = sqrt(2.25 + 4) = 2.5G
    // dynamicVibration = abs(2.5 - 1.0) = 1.5G
    await act(async () => {
      (Accelerometer as any).mockEmit({ x: 0.0, y: 1.5, z: 2.0 });
    });
    expect(getByText("Current Force: 1.500 G")).toBeTruthy();

    // 5. Complete test scenario pass execution to push metrics data up to cloud servers
    const stopButton = getByText("Stop Recording");
    await act(async () => {
      fireEvent.press(stopButton);
    });

    expect(Vibration.cancel).toHaveBeenCalled();

    await waitFor(() => {
      expect(uploadVibrationData).toHaveBeenCalledWith(
        { uid: "test-stretch-uid", email: "material_science@test.com" },
        expect.objectContaining({
          averageMovementIntensity: 0.75, // (0.0 + 1.5) / 2
          peakMovementIntensity: 1.5,
          movementType: "Tensile Concrete Grid",
        }),
      );
      expect(getByText("Data saved successfully!")).toBeTruthy();
    });

    // 6. Test results dashboard routing interface click paths
    const viewResultsButton = getByText("View Results");
    await act(async () => {
      fireEvent.press(viewResultsButton);
    });

    expect(router.push).toHaveBeenCalledWith("/StretchTest/stretch_results");
  });

  it("silences background subthreads automatically on component unmount to protect phone memory", () => {
    const { unmount, getByText, getByPlaceholderText } = render(
      <StretchTest />,
    );

    const input = getByPlaceholderText("Enter stretch type");
    fireEvent.changeText(input, "Seismic Rebar");

    const recordButton = getByText("Start Recording");
    act(() => {
      fireEvent.press(recordButton);
    });

    // Unmount the component tree while actively tracking hardware updates
    unmount();

    expect(Vibration.cancel).toHaveBeenCalled();
  });
});
