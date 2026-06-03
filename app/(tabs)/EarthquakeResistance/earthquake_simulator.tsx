import { auth, uploadEarthquakeData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Accelerometer, Gyroscope } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Vibration,
  View,
} from "react-native";

interface TelemetrySample {
  acceleration: number;
  rotation: number;
}

export default function EarthquakeSimulator() {
  const [vibration, setVibration] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0); // New live tracking state

  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [successText, setSuccessText] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Hardware Subscription References
  const accelSubRef = useRef<any>(null);
  const gyroSubRef = useRef<any>(null);
  const vibrationRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const recordedDataRef = useRef<TelemetrySample[]>([]);
  const [structureName, setStructureName] = useState<string>("");
  const isSimulatingRef = useRef<boolean>(false);
  const [time, setTime] = useState(15);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const user = auth.currentUser;

  const stopAllActivity = async () => {
    isSimulatingRef.current = false;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (vibrationRef.current) clearTimeout(vibrationRef.current);

    Vibration.cancel();

    // Disengage Accelerometer
    if (accelSubRef.current) {
      accelSubRef.current.remove();
      accelSubRef.current = null;
    }
    // Disengage Gyroscope
    if (gyroSubRef.current) {
      gyroSubRef.current.remove();
      gyroSubRef.current = null;
    }

    setIsRecording(false);
    setVibration(0);
    setRotation(0);
  };

  useEffect(() => {
    return () => {
      stopAllActivity();
    };
  }, []);

  const startRecording = () => {
    if (accelSubRef.current || gyroSubRef.current) return;

    recordedDataRef.current = [];
    setIsRecording(true);

    // Explicitly sync timing updates across hardware frames
    Accelerometer.setUpdateInterval(100);
    Gyroscope.setUpdateInterval(100);

    // Local snapshot logs to pair coordinates across sensor callbacks
    let currentAcc = 0;

    // 1. Monitor Linear Shaking Forces
    accelSubRef.current = Accelerometer.addListener((data) => {
      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
      );
      let dynamicVibration = Math.abs(totalForce - 1.0);
      if (dynamicVibration < 0.03) dynamicVibration = 0; // Noise gate

      currentAcc = dynamicVibration;
      setVibration(dynamicVibration);
    });

    // 2. Monitor Structural Twisting/Tilting (Gyro)
    gyroSubRef.current = Gyroscope.addListener((data) => {
      // Total Rotational Vector Magnitude (rad/s)
      const totalRotation = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
      );
      let dynamicRotation = totalRotation;
      let currentGyro = 0;
      if (dynamicRotation < 0.02) dynamicRotation = 0; // Noise gate
      currentGyro = dynamicRotation;
      setRotation(dynamicRotation);

      // Record paired telemetry samples to the collection array
      recordedDataRef.current.push({
        acceleration: parseFloat(currentAcc.toFixed(4)),
        rotation: parseFloat(dynamicRotation.toFixed(4)),
      });
    });
  };

  const processAndUploadLogs = async () => {
    if (recordedDataRef.current.length > 0) {
      const totalSamples = recordedDataRef.current.length;

      // Calculate Combined Structural Movement Metrics
      const sumAcc = recordedDataRef.current.reduce(
        (acc, cur) => acc + cur.acceleration,
        0,
      );
      const sumGyro = recordedDataRef.current.reduce(
        (acc, cur) => acc + cur.rotation,
        0,
      );

      const avgAcc = parseFloat((sumAcc / totalSamples).toFixed(4));
      const avgGyro = parseFloat((sumGyro / totalSamples).toFixed(4));

      const peakAcc = Math.max(
        ...recordedDataRef.current.map((s) => s.acceleration),
      );
      const peakGyro = Math.max(
        ...recordedDataRef.current.map((s) => s.rotation),
      );

      // Sensor Fusion Index: We scale rotation and acceleration together
      // to yield a single total destructive movement rating
      const combinedAverage = parseFloat((avgAcc + avgGyro).toFixed(4));
      const combinedPeak = parseFloat((peakAcc + peakGyro).toFixed(4));

      try {
        await uploadEarthquakeData(
          user,
          structureName,
          combinedAverage, // Pushed down as average movement intensity
          combinedPeak, // Pushed down as peak structural movement intensity
        );
        setSuccessText(true);
        setSaveStatus("Sensor Fusion telemetry logged successfully!");
      } catch (e) {
        console.error(e);
        setErrorText(true);
        setSaveStatus("Failed to save metrics.");
      }
    }
  };

  const runEarthquakeTick = (isInitialShock = false) => {
    if (!isSimulatingRef.current) return;

    if (isInitialShock) {
      Vibration.vibrate([0, 1000, 150, 400]);
    } else {
      const randomIntensityRumble =
        Math.floor(Math.random() * (500 - 100 + 1)) + 100;
      Vibration.vibrate([0, randomIntensityRumble]);
    }

    const nextInterval = Math.floor(Math.random() * (2000 - 600 + 1)) + 600;
    vibrationRef.current = setTimeout(() => {
      runEarthquakeTick(false);
    }, nextInterval);
  };

  const countDown = async () => {
    // login bypass
    // if (!user) return;
    if (!structureName.trim()) {
      setSaveStatus("Please define a structure name before beginning.");
      return;
    }

    await stopAllActivity();
    setSaveStatus("");
    setSuccessText(false);
    setErrorText(false);
    setTime(15);
    setStopTest(false);
    setStartTest(true);
    isSimulatingRef.current = true;

    startRecording();
    runEarthquakeTick(true);

    intervalRef.current = setInterval(async () => {
      setTime((prev) => {
        if (prev <= 1) {
          stopAllActivity().then(() => {
            processAndUploadLogs();
            setStopTest(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}>
      <Text style={styles.title}>Seismic Fusion Simulator</Text>

      <View style={[styles.colContainer, { marginVertical: 10 }]}>
        <TextInput
          style={styles.sUser}
          placeholder="Enter structure name"
          onChangeText={setStructureName}
          value={structureName}
          editable={!isRecording}
        />

        {/* Dual Telemetry Readout Bars */}
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.text, { fontSize: 14, color: "#4CAF50" }]}>
            Linear Acceleration: {vibration.toFixed(4)} G
          </Text>
          <Text
            style={[
              styles.text,
              { fontSize: 14, color: "#2196F3", marginTop: 5 },
            ]}
          >
            Angular Rotation: {rotation.toFixed(4)} rad/s
          </Text>
        </View>

        <Text
          style={[
            styles.text,
            {
              fontSize: 22,
              fontWeight: "600",
              paddingTop: 20,
              color: isSimulatingRef.current ? "#F44336" : theme.text,
            },
          ]}
        >
          Time Remaining: {time}s
        </Text>
      </View>

      <View style={styles.colContainer}>
        {saveStatus ? (
          <Text
            style={[
              styles.text,
              {
                color: successText ? "#4CAF50" : "#F44336",
                marginBottom: 10,
                textAlign: "center",
              },
            ]}
          >
            {saveStatus}
          </Text>
        ) : null}
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
              ? "Restart Test"
              : "Start Sensor Fusion Test"}
          </Text>
        </TouchableOpacity>
      </View>

      {stopTest && (
        <View style={styles.colContainer} testID="Simulation Completed!">
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#4A90E2", width: "100%", marginTop: 15 },
            ]}
            onPress={() =>
              router.push("/EarthquakeResistance/earthquake_results")
            }
          >
            <Text style={styles.buttonText}>Review Combined Analytics</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
