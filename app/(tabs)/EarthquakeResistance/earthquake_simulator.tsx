// strongest vibration on start
// then after time, stops
// simulate earthquake by vibrating at random intervals and intensities for a few seconds
// then stops and shows results
import { globalStyles } from "@/Styles/globalStyles";

import { auth } from "@/firebase";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    useColorScheme,
    Vibration,
    View,
} from "react-native";

export default function EarthquakeSimulator() {
  const [vibrationTest, setVibrationTest] = useState(false);
  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);

  const [time, setTime] = useState(15);
  const intervalRef = useRef<any>(null);
  const vibrationRef = useRef<any>(null);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  // Cleanup timers safely if the user changes pages mid-shake
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      Vibration.cancel(); // Stop any active hardware vibrations
    };
  }, []);

  const startRandomEarthquake = () => {
    if (vibrationTest) return; // Prevent multiple concurrent tests
    setVibrationTest(true);
    setVibrationTest(true);
    // 1. Trigger an immediate heavy shock pattern: [Wait 0ms, Vibrate 400ms, Wait 100ms, Vibrate 200ms]
    Vibration.vibrate([0, 400, 100, 200]);

    // 2. Generate a random delay before the next aftershock (between 800ms and 2500ms)
    const nextInterval = Math.floor(Math.random() * (2500 - 800 + 1)) + 800;

    // 3. Queue up the next random tremor recursively
    vibrationRef.current = setTimeout(() => {
      startRandomEarthquake();
    }, nextInterval);
  };

  const countDown = () => {
    const user = auth.currentUser;
    if (!user) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (vibrationRef.current) clearTimeout(vibrationRef.current);

    setTime(15);
    setStopTest(false);
    setStartTest(true);
    startRandomEarthquake();

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          // Use a tiny timeout to let the state cycle commit '0' before halting the test
          setTimeout(() => setStopTest(true), 0);
          setStopTest(true);
          Vibration.cancel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // const saveTestScore = async () => {
  //   try {
  //     if (!user) return;
  //     const scores = {
  //       testType: "test3",
  //       userId: user?.uid,
  //       email: user?.email,
  //       score: clickCount,
  //       timestamp: Date.now(),
  //     };
  //     saveScore(user, scores);
  //     console.log("score saved!");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (stopTest) {
  //     saveTestScore();
  //   }
  // }, [stopTest]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earthquake Simulator</Text>
      <TouchableOpacity onPress={() => countDown()}>
        <Text style={styles.buttonText}>Start Simulation</Text>
      </TouchableOpacity>
    </View>
  );
}
