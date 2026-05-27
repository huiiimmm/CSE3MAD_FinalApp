import { globalStyles } from "@/app/Styles/globalStyles";
import { auth, saveScore } from "@/firebase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      style={[globalStyles.container, { backgroundColor: bgColor }]}
    >
      {readyText && (
        <>
          <Text style={globalStyles.title}>Test 1 - Dominant Hand</Text>
          <Text style={globalStyles.text}>Tap as soon as you see green</Text>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setReadyText(false);
              setBgColor("red");
              startRandomTimer();
            }}
          >
            <Text style={globalStyles.buttonText}>Start</Text>
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
          <Text style={globalStyles.text}>Too early!</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              setReadyText(true);
              setEarlyCheck(false);
              setRestartTest(false);
              setBgColor("#1e1e1e");
            }}
          >
            <Text style={globalStyles.buttonText}>Restart Test</Text>
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
            setRecordResults(true);
          }}
        />
      )}

      {nextTestButton && (
        <>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              router.push("/test2");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={globalStyles.buttonText}>Next Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              router.push("./directory");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={globalStyles.buttonText}>All Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              router.push("./menu");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={globalStyles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
