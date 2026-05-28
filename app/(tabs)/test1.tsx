import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { auth, saveScore } from "@/firebase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const scheme = useColorScheme();
const theme = scheme === "dark" ? darkTheme : lightTheme;
const styles = globalStyles(theme);

export default function Test1() {
  const [readyText, setReadyText] = useState(true);
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [reactionScreen, setReactionScreen] = useState(false);
  const [earlyCheck, setEarlyCheck] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);
  const [recordResults, setRecordResults] = useState(false);
  const [restartTest, setRestartTest] = useState(false);
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const user = auth.currentUser;

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const randomRef = useRef<number | null>(null);
  const startTimer = () => {
    startRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startRef.current!);
    }, 10);
  };

  const stopTimer = () => {
    if (startRef.current) {
      setReactionTime(Date.now() - startRef.current);

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
    else {
      randomRef.current = setTimeout(() => {
        setBgColor("green");
        setReactionScreen(true);
        startTimer();
      }, delay);
    }
  };
  const restart = () => {
    setRestartTest(true);

    if (randomRef.current) {
      clearTimeout(randomRef.current);
    }
  };

  async function saveTestScore() {
    try {
      if (!user) return;
      const scores = {
        testType: "test1",
        userId: user?.uid,
        email: user?.email,
        score: reactionTime,
        timestamp: Date.now(),
      };
      saveScore(user, scores);
      console.log("score saved!");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (recordResults) {
      saveTestScore();
    }
  }, [recordResults]);

  return (
    <View
      testID="test1"
      style={[styles.container, { backgroundColor: bgColor }]}
    >
      {readyText && (
        <>
          <Text style={styles.title}>Test 1 - Dominant Hand</Text>
          <Text style={styles.text}>Tap as soon as you see green</Text>

          <TouchableOpacity
            testID="startButton"
            style={styles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setReadyText(false);
              setBgColor("red");
              startRandomTimer();
            }}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      )}

      {!readyText && <Text style={styles.text}>Reaction Speed: {time}ms</Text>}
      {earlyCheck && (
        <Pressable
          testID="earlyCheck"
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            stopTimer();
            restart();
            setRestartTest(true);
          }}
        />
      )}
      {restartTest && (
        <>
          <Text style={styles.text}>Too early!</Text>
          <TouchableOpacity
            testID="restartButton"
            style={styles.button}
            onPress={() => {
              setReadyText(true);
              setEarlyCheck(false);
              setRestartTest(false);
              setBgColor("#1e1e1e");
            }}
          >
            <Text style={styles.buttonText}>Restart Test</Text>
          </TouchableOpacity>
        </>
      )}
      {reactionScreen && (
        <Pressable
          testID="reactionScreen"
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            stopTimer();
            setNextTestButton(true);
            setRecordResults(true);
          }}
        />
      )}

      {nextTestButton && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/test2");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Next Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("./directory");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>All Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("./menu");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
