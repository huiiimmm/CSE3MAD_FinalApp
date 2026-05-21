import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ResultsScreen from "./results";

export default function Test1() {
  const [readyText, setReadyText] = useState(true);
  const [bgColor, setBgColor] = useState("#1e1e1e");
  const [reactionScreen, setReactionScreen] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

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

    setTimeout(() => {
      setBgColor("green");
      setReactionScreen(true);
      startTimer();
    }, delay);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {readyText && (
        <>
          <Text style={styles.title}>Test 1 - Dominant Hand</Text>
          <Text style={styles.text}>Tap as soon as you see green</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setReadyText(false);
              setBgColor("red");
              startRandomTimer();
            }}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={{ color: "white", fontSize: 30 }}>{time}ms</Text>

      {reactionScreen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            stopTimer();
            setNextTestButton(true);
            setShowResults(true);
          }}
        />
      )}

      {nextTestButton && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/test2")}
        >
          <Text style={styles.buttonText}>Next Test</Text>
        </TouchableOpacity>
      )}

      {showResults && <ResultsScreen reactionTime={reactionTime} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 32,
    marginBottom: 20,
  },

  text: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
