import { auth, db } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function Test2() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const [readyText, setReadyText] = useState(true);
  const [bgColor, setBgColor] = useState(theme.background);

  const [reactionScreen, setReactionScreen] = useState(false);
  const [earlyCheck, setEarlyCheck] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [restartTest, setRestartTest] = useState(false);

  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const user = auth.currentUser;

  const intervalRef = useRef<any>(null);
  const startRef = useRef<any>(null);
  const randomRef = useRef<any>(null);

  const startTimer = () => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startRef.current!);
    }, 10);
  };

  const stopTimer = () => {
    if (startRef.current) {
      const duration = Date.now() - startRef.current;
      setReactionTime(duration);
      setTime(duration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      startRef.current = null;
    }
  };

  const startRandomTimer = () => {
    const delay = Math.random() * 8000 + 2000;
    setEarlyCheck(true);
    if (restartTest) return;

    randomRef.current = setTimeout(() => {
      setEarlyCheck(false); // Remove early tap interception layer
      setBgColor("#4CAF50"); // Using standard vibrant green asset profile
      setReactionScreen(true);
      startTimer();
    }, delay);
  };

  const restart = () => {
    setRestartTest(true);
    setEarlyCheck(false);
    setReactionScreen(false);
    if (randomRef.current) {
      clearTimeout(randomRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const saveScore = async () => {
    try {
      if (!user) return;
      await addDoc(collection(db, "scores"), {
        testType: "test2",
        userId: user?.uid,
        email: user?.email,
        score: reactionTime,
        timestamp: Date.now(),
      });
      console.log("Reaction score saved successfully!");
    } catch (error) {
      console.error("Error committing score down to cloud ledger:", error);
    }
  };

  useEffect(() => {
    if (showResults && reactionTime > 0) {
      saveScore();
    }
  }, [showResults, reactionTime]);

  // Handle component teardown lifecycle cleanly
  useEffect(() => {
    return () => {
      if (randomRef.current) clearTimeout(randomRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          paddingHorizontal: 16,
          justifyContent: "center",
        },
      ]}
    >
      {/* Absolute Layer Interceptors for Input Capture */}
      {earlyCheck && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            restart();
          }}
        />
      )}

      {reactionScreen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            stopTimer();
            setReactionScreen(false);
            setNextTestButton(true);
            setShowResults(true);
          }}
        />
      )}

      {/* Main Structural Display Layer */}
      <View
        style={[
          styles.colContainer,
          { width: "100%", zIndex: 1, pointerEvents: "box-none" },
        ]}
      >
        {readyText && (
          <>
            <Text style={styles.title}>Test 2 - Non-Dominant Hand</Text>
            <Text style={[styles.text, { marginBottom: 25, opacity: 0.8 }]}>
              Tap anywhere on the screen as soon as the background color
              transitions to green.
            </Text>

            <TouchableOpacity
              style={[styles.button, { width: "100%" }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setReadyText(false);
                setBgColor("#F44336"); // Hot warning red standby block
                startRandomTimer();
              }}
            >
              <Text style={styles.buttonText}>Start Assessment</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Real-time Dynamic Running Timer Display */}
        {!readyText && !restartTest && !nextTestButton && (
          <Text
            style={[
              styles.text,
              { fontSize: 24, fontWeight: "bold", color: "#fff" },
            ]}
          >
            {reactionScreen ? "TAP NOW!" : `Time Tracker: ${time} ms`}
          </Text>
        )}

        {/* Premature Action Reset Canvas UI */}
        {restartTest && (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={[styles.title, { color: "#fff" }]}>Too Early!</Text>
            <Text style={[styles.text, { marginBottom: 20, color: "#fff" }]}>
              You tapped before the environment changed color profiles.
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                { width: "100%", backgroundColor: "#fff" },
              ]}
              onPress={() => {
                setReadyText(true);
                setRestartTest(false);
                setBgColor(theme.background);
                setTime(0);
                setReactionTime(0);
                setShowResults(false);
              }}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Post-Assessment Success View & Navigation Routes */}
        {nextTestButton && (
          <View style={{ width: "100%", alignItems: "center" }}>
            <View
              style={[
                styles.dataCard,
                {
                  width: "100%",
                  padding: 20,
                  marginBottom: 20,
                  borderColor: "#4CAF50",
                  borderWidth: 2,
                },
              ]}
            >
              <Text style={[styles.text, { fontSize: 14, color: "gray" }]}>
                FINAL RESPONSE TIME
              </Text>
              <Text
                style={[
                  styles.title,
                  { fontSize: 32, marginVertical: 4, color: theme.text },
                ]}
              >
                {reactionTime} ms
              </Text>
              <Text
                style={[
                  styles.text,
                  { fontSize: 13, color: "#4CAF50", fontWeight: "600" },
                ]}
              >
                Metrics synced successfully with your account profile!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { width: "100%" }]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/test3");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.buttonText}>Proceed to Test 3</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: theme.card || "#4A90E2",
                },
              ]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/directory");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  theme.card ? { color: theme.text } : { color: "#fff" },
                ]}
              >
                View All Tests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: theme.border || "#ccc",
                },
              ]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/menu");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Back to Menu
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
