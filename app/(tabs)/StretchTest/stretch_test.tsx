// activate vibration sensor
// perform movements - circle, figure 8, left and right, up and down
// record the vibration
//repeat activity with vibration feedback enabled
// review speed, smoothness, and rom
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { Accelerometer } from "expo-sensors";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";

import { auth, uploadVibrationData } from "@/firebase";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

// upload tracking messages

// Define TypeScript structure for recording payloads
interface VibrationSample {
  intensity: number;
  duration: number;
}

export default function StretchTest() {
  const [vibration, setVibration] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [stretchType, setStretchType] = useState<string>("");
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const accelSubRef = useRef<any>(null);
  // Holds high-frequency samples without triggering expensive React redraws mid-test
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
    setSaveStatus("");
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

      // Log every single microscopic movement tick to our tracking array
      recordedDataRef.current.push({
        intensity: parseFloat(dynamicVibration.toFixed(4)),
        duration: Date.now() - startTimeRef.current, // Relative time in ms
      });
    });
  };
  const stopRecording = async () => {
    setIsRecording(false);
    if (accelSubRef.current) {
      accelSubRef.current.remove();
      accelSubRef.current = null;
    }
    setVibration(0);

    // Only attempt to process and save if data was collected
    if (recordedDataRef.current.length > 0) {
      if (!stretchType) {
        setSaveStatus("Please define a stretch before saving.");
        return;
      }
      // Calculate aggregated summary analytics from our recorded data array
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

      await uploadVibrationData(
        user,
        avgIntensity,
        peakIntensity,
        durationSeconds,
        stretchType,
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stretch Test</Text>
      <View style={styles.colContainer}>
        <TextInput
          style={styles.sUser}
          placeholder="Enter stretch type"
          onChangeText={setStretchType}
          value={stretchType}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            isRecording ? stopRecording() : startRecording();
          }}
        >
          <Text style={styles.buttonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>

          <Text style={styles.buttonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
