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
  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);

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
  };

  const countDown = () => {
    const user = auth.currentUser;
    if (!user) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (vibrationRef.current) clearTimeout(vibrationRef.current);

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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to start the simulation.</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Earthquake Simulator</Text>
        <Text style={{ fontSize: 20, marginVertical: 10 }}>
          Time Remaining: {time}s
        </Text>

        <TouchableOpacity onPress={countDown} style={styles.button}>
          <Text style={styles.buttonText}>
            {isSimulatingRef.current
              ? "Restart Simulation"
              : "Start Simulation"}
          </Text>
        </TouchableOpacity>

        {stopTest && (
          <View style={styles.rowContainer}>
            <Text style={styles.text}>
              Simulation Completed! Showing Results...
            </Text>
          </View>
        )}
      </View>
    );
  }
}
