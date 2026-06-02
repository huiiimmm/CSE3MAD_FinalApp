import { auth, uploadEarthquakeData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Accelerometer } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View,
} from "react-native";

interface VibrationSample {
  intensity: number;
}

export default function EarthquakeSimulator() {
  const [vibration, setVibration] = useState<number>(0);

  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [successText, setSuccessText] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const accelSubRef = useRef<any>(null);
  const vibrationIntervalRef = useRef<any>(null);
  const recordedDataRef = useRef<VibrationSample[]>([]);
  const startTimeRef = useRef<number>(0);
  const [structureName, setStructureName] = useState<string>("");

  // Use a mutable ref to track active simulation state across threads instantly
  const isSimulatingRef = useRef<boolean>(false);

  const [time, setTime] = useState(15);
  const intervalRef = useRef<any>(null);
  const vibrationRef = useRef<any>(null);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const user = auth.currentUser;

  // Unified absolute cleanup engine
  const stopAllActivity = () => {
    isSimulatingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (vibrationRef.current) {
      clearTimeout(vibrationRef.current);
      vibrationRef.current = null;
    }
    Vibration.cancel();
  };

  useEffect(() => {
    return () => stopAllActivity();
  }, []);

  const startRecording = () => {
    if (!structureName.trim()) {
      setSaveStatus("Please define a structure name before beginning.");
      return;
    }
    // Reset status and outcome messages from any previous runs
    setSaveStatus("");
    setSuccessText(false);
    setErrorText(false);

    recordedDataRef.current = [];
    startTimeRef.current = Date.now();
    setIsRecording(true);

    accelSubRef.current = Accelerometer.addListener((data) => {
      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
      );
      let dynamicVibration = Math.abs(totalForce - 1.0);
      if (dynamicVibration < 0.03) dynamicVibration = 0; // Filter micro-noise

      setVibration(dynamicVibration);

      recordedDataRef.current.push({
        intensity: parseFloat(dynamicVibration.toFixed(4)),
      });
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);

    // Clear our background motor refresh interval loop
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }

    // Silence phone hardware coil immediately
    Vibration.cancel();

    if (accelSubRef.current) {
      accelSubRef.current.remove();
      accelSubRef.current = null;
    }
    setVibration(0);

    if (recordedDataRef.current.length > 0) {
      if (!structureName) {
        setSaveStatus("Please define a structure name before saving.");
        return;
      }

      const totalSamples = recordedDataRef.current.length;
      const sumIntensity = recordedDataRef.current.reduce(
        (acc, cur) => acc + cur.intensity,
        0,
      );
      const avgStructureMovementIntensity = parseFloat(
        (sumIntensity / totalSamples).toFixed(4),
      );

      const peakStructureMovementIntensity = Math.max(
        ...recordedDataRef.current.map((s) => s.intensity),
      );

      try {
        await uploadEarthquakeData(
          user,
          structureName,
          avgStructureMovementIntensity,
          peakStructureMovementIntensity,
        );
        setSuccessText(true);
        setSaveStatus("Data saved successfully!");
      } catch (e) {
        console.error("Error uploading earthquake data: ", e);
        setErrorText(true);
        setSaveStatus("Failed to save data. Please try again.");
      }
    }
  };

  const runEarthquakeTick = (isInitialShock = false) => {
    // Instantly break the cycle if the test has been flagged to stop
    if (!isSimulatingRef.current) return;

    if (isInitialShock) {
      // 1. Strongest Initial Shock: Heavy, long rumble profile
      Vibration.vibrate([0, 1000, 150, 400]);
    } else {
      // 2. Randomized Aftershock Intensities
      // We simulate intensity variation by changing active motor rumble durations
      const randomIntensityRumble =
        Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      Vibration.vibrate([0, randomIntensityRumble]);
    }

    // 3. Generate randomized quiet spacing interval between aftershocks
    const nextInterval = Math.floor(Math.random() * (2000 - 600 + 1)) + 600;

    vibrationRef.current = setTimeout(() => {
      runEarthquakeTick(false);
    }, nextInterval);
    startRecording();

    // Schedule a stop recording after 4 seconds to capture each shock's full profile
    setTimeout(() => {
      stopRecording();
    }, 4000);
  };

  const countDown = () => {
    if (!user) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (vibrationRef.current) clearTimeout(vibrationRef.current);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    setTime(15);
    setStopTest(false);
    setStartTest(true);
    isSimulatingRef.current = true;
    runEarthquakeTick(true);

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          stopAllActivity();
          setStopTest(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={styles.text}>Please log in to start the simulation.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}>
      <Text style={styles.title}>Earthquake Simulator</Text>

      {/* Visual countdown tracking read-out */}
      <View style={[styles.colContainer, { marginVertical: 10 }]}>
        <Text
          style={[
            styles.text,
            { fontSize: 22, fontWeight: "600", paddingBottom: 20 },
          ]}
        >
          Enter a name for your structure
        </Text>
        <TextInput
          style={styles.sUser}
          placeholder="Enter structure name"
          onChangeText={setStructureName}
          value={structureName}
          editable={!isRecording}
        />
        <Text
          style={[
            styles.text,
            {
              fontSize: 22,
              fontWeight: "600",
              color: isSimulatingRef.current ? "#F44336" : theme.text,
              paddingTop: 20,
            },
          ]}
        >
          Time Remaining: {time}s
        </Text>
      </View>

      <View style={styles.colContainer}>
        <TouchableOpacity
          onPress={countDown}
          style={[
            styles.button,
            { width: "100%" },
            isSimulatingRef.current && { backgroundColor: "#F44336" },
          ]}
        >
          <Text style={styles.buttonText}>
            {isSimulatingRef.current
              ? "Restart Simulation"
              : "Start Simulation"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional completed outcome panel */}
      {stopTest && (
        <View style={styles.colContainer}>
          <View
            style={[
              styles.rowContainer,
              {
                borderColor: "#4CAF50",
                borderWidth: 2,
                borderRadius: 10,
                marginTop: 15,
              },
            ]}
          >
            <Text style={[styles.text, { fontSize: 16, fontWeight: "600" }]}>
              Simulation Completed!
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#4A90E2", width: "100%", marginTop: 15 },
            ]}
            onPress={() =>
              router.push("/EarthquakeResistance/earthquake_results")
            }
          >
            <Text style={styles.buttonText}>Review Analytical Logs</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
