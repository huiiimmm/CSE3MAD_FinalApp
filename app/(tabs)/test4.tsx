import { auth, saveScore } from "@/firebase";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Test4() {
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [readyText, setReadyText] = useState(true);
  const [nextTestButton, setNextTestButton] = useState(false);

  const user = auth.currentUser;

  const intervalRef = useRef<number | null>(null);
  const detectionInterval = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // 🔥 FIX 1: global locks (prevents duplicate recordings/timers)
  const recordingLock = useRef(false);
  const timerLock = useRef(false);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./audio/beep-07a.mp3"),
      { shouldPlay: false, volume: 1.0 },
    );
    soundRef.current = sound;
  };

  const startRandomTimer = async () => {
    const delay = Math.random() * 8000 + 2000;

    await loadSound();

    setTimeout(async () => {
      await soundRef.current?.replayAsync();
      startTimer();
    }, delay);
  };

  const startTimer = async () => {
    if (timerLock.current) return;
    timerLock.current = true;

    startRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startRef.current!);
    }, 10);

    await detectSound();
  };

  // 🔥 FIX 2: fully safe recording lifecycle
  const detectSound = async () => {
    if (recordingLock.current) return;
    recordingLock.current = true;

    try {
      // 🧹 hard cleanup before new recording
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;

        // important native buffer delay
        await new Promise((res) => setTimeout(res, 200));
      }

      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });

      await recording.startAsync();

      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }

      detectionInterval.current = setInterval(async () => {
        const status = await recording.getStatusAsync();

        if (!status.metering || !startRef.current) return;

        if (status.metering > -20) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

          stopTimer();

          clearInterval(detectionInterval.current!);
          detectionInterval.current = null;

          await stopRecording();

          setNextTestButton(true);

          recordingLock.current = false;
        }
      }, 80);
    } catch (e) {
      console.log("detectSound error:", e);
      recordingLock.current = false;
    }
  };

  const stopTimer = () => {
    timerLock.current = false;

    if (startRef.current) {
      setReactionTime(Date.now() - startRef.current);
      startRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const saveTestScore = async () => {
    try {
      if (!user) return;

      const scores = {
        testType: "test4",
        userId: user.uid,
        email: user.email,
        score: reactionTime,
        timestamp: Date.now(),
      };
      saveScore(user, scores);

      console.log("score saved!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (nextTestButton) {
      saveTestScore();
    }
  }, [nextTestButton]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      stopRecording();
    };
  }, []);

  return (
    <View testID="test4" style={styles.container}>
      {readyText && (
        <>
          <Text style={styles.title}>Test 4 - Sound Reaction</Text>

          <Text style={styles.text}>
            Tap start, then react when you hear the sound or make a loud noise
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setReadyText(false);
              startRandomTimer();
            }}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      )}

      {!readyText && (
        <Text style={{ color: "white", fontSize: 30 }}>{time} ms</Text>
      )}

      {nextTestButton && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/results");
          }}
        >
          <Text style={styles.buttonText}>Results</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
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
