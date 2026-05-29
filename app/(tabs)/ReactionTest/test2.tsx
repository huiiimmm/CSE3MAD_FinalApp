import { globalStyles } from "@/app/(tabs)/Styles/globalStyles";

import { darkTheme } from "@/app/(tabs)/Styles/Themes/dark";
import { lightTheme } from "@/app/(tabs)/Styles/Themes/light";
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
import { auth, db } from "./firebase";

export default function Test2() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const [readyText, setReadyText] = useState(true);
  const [bgColor, setBgColor] = useState(theme.background);
  const [reactionScreen, setReactionScreen] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const user = auth.currentUser;

  const [earlyCheck, setEarlyCheck] = useState(false);
  const [restartTest, setRestartTest] = useState(false);

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
      console.log("score saved!");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (showResults) {
      saveScore();
    }
  }, [showResults]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {readyText && (
        <>
          <Text style={styles.title}>Test 2 - Non-Dominant Hand</Text>
          <Text style={styles.text}>Tap as soon as you see green</Text>

          <TouchableOpacity
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

      {!readyText && (
        <Text style={{ color: "white", fontSize: 30 }}>{time}ms</Text>
      )}
      {earlyCheck && (
        <Pressable
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
          style={StyleSheet.absoluteFill}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            stopTimer();
            setNextTestButton(true);
            setShowResults(true);
          }}
        />
      )}

      {nextTestButton && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/test3");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Next Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/directory");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>All Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/menu");
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
