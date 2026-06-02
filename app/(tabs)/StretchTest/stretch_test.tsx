import { auth, uploadVibrationData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
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
  duration: number;
}

export default function StretchTest() {
  const [vibration, setVibration] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [stretchType, setStretchType] = useState<string>("");

  const [successText, setSuccessText] = useState(false);
  const [errorText, setErrorText] = useState(false);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const accelSubRef = useRef<any>(null);
  const vibrationIntervalRef = useRef<any>(null);
  const recordedDataRef = useRef<VibrationSample[]>([]);
  const startTimeRef = useRef<number>(0);
  const user = auth.currentUser;

  useEffect(() => {
    Accelerometer.setUpdateInterval(16); // 60Hz high-precision polling
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = () => {
    if (!stretchType.trim()) {
      setSaveStatus("Please define a stretch type before beginning.");
      return;
    }

    // Reset status and outcome messages from any previous runs
    setSaveStatus("");
    setSuccessText(false);
    setErrorText(false);

    recordedDataRef.current = [];
    startTimeRef.current = Date.now();
    setIsRecording(true);

    // UNINTERRUPTED CONSTANT HUM:
    // Trigger the initial single-shot raw vibration burst
    Vibration.vibrate(10000);

    // Create a background heartbeat to refresh the hum before it can drop out
    vibrationIntervalRef.current = setInterval(() => {
      Vibration.vibrate(10000);
    }, 4000);

    accelSubRef.current = Accelerometer.addListener((data) => {
      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
      );
      let dynamicVibration = Math.abs(totalForce - 1.0);
      if (dynamicVibration < 0.03) dynamicVibration = 0; // Filter micro-noise

      setVibration(dynamicVibration);

      recordedDataRef.current.push({
        intensity: parseFloat(dynamicVibration.toFixed(4)),
        duration: Date.now() - startTimeRef.current,
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
      if (!stretchType) {
        setSaveStatus("Please define a stretch before saving.");
        return;
      }

      const totalSamples = recordedDataRef.current.length;
      const sumIntensity = recordedDataRef.current.reduce(
        (acc, cur) => acc + cur.intensity,
        0,
      );
      const avgIntensity = parseFloat((sumIntensity / totalSamples).toFixed(4));

      const peakIntensity = Math.max(
        ...recordedDataRef.current.map((s) => s.intensity),
      );
      const durationSeconds = parseFloat(
        ((Date.now() - startTimeRef.current) / 1000).toFixed(2),
      );

      try {
        await uploadVibrationData(user, {
          averageMovementIntensity: avgIntensity,
          peakMovementIntensity: peakIntensity,
          movementDuration: durationSeconds,
          movementType: stretchType,
        });
        setSuccessText(true);
        setSaveStatus("Data saved successfully!");
      } catch (e) {
        console.error("Error uploading vibration data: ", e);
        setErrorText(true);
        setSaveStatus("Failed to save data. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stretch Test</Text>

      {/* Realtime Telemetry Display UI HUD */}
      <View style={{ marginVertical: 10, alignItems: "center" }}>
        <Text
          style={[styles.text, { color: isRecording ? "#4A90E2" : "gray" }]}
        >
          {isRecording
            ? `Current Force: ${vibration.toFixed(3)} G`
            : "Sensors Stopped"}
        </Text>
      </View>

      <View style={styles.colContainer}>
        <TextInput
          style={styles.sUser}
          placeholder="Enter stretch type"
          onChangeText={setStretchType}
          value={stretchType}
          editable={!isRecording}
        />

        <TouchableOpacity
          style={[styles.button, isRecording && { backgroundColor: "#F44336" }]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>

        {/* Validation Error/Fallback Messaging */}
        {saveStatus && !successText && !errorText && (
          <Text
            style={[
              styles.text,
              { color: "orange", marginTop: 15, fontSize: 14 },
            ]}
          >
            {saveStatus}
          </Text>
        )}

        {successText && (
          <View style={styles.colContainer}>
            <Text style={[styles.text, { color: "green", marginBottom: 5 }]}>
              Data saved successfully!
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/StretchTest/stretch_results")}
            >
              <Text style={styles.buttonText}>View Results</Text>
            </TouchableOpacity>
          </View>
        )}

        {errorText && (
          <Text style={[styles.text, { color: "red", marginTop: 15 }]}>
            Failed to save data. Please try again.
          </Text>
        )}
      </View>
    </View>
  );
}
