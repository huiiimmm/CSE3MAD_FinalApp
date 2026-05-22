import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { auth, db } from "./firebase";

export default function Test4() {
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const user = auth.currentUser;
  const [readyText, setReadyText] = useState(true);
  const [reactionScreen, setReactionScreen] = useState(false);
  const [nextTestButton, setNextTestButton] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [soundLevel, setSoundLevel] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [active, setActive] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const detectionInterval = useRef<any>(null);

  const startTimer = async () => {
    startRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startRef.current!);
    }, 10);

    // mic detection
    await startListening();
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
    setTimeout(async () => {
      await soundRef.current?.replayAsync();
      startTimer();
      loadSound();
    }, delay);
  };

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("assets/audio/beep-07a.mp3"),
    );
    soundRef.current = sound;
  };

  const startListening = async () => {
    await Audio.requestPermissionsAsync();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    recordingRef.current = recording;

    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();

    startTimer();
    detectSound();
  };

  const detectSound = async () => {
    await Audio.requestPermissionsAsync();

    const recording = new Audio.Recording();
    recordingRef.current = recording;

    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();

    detectionInterval.current = setInterval(async () => {
      const status = await recording.getStatusAsync();

      if (!status.metering) return;
      //threshold
      if (status.metering > -20) {
        stopTimer();
        setNextTestButton(true);
      }
    }, 80);
  };

  const saveScore = async () => {
    try {
      if (!user) return;
      await addDoc(collection(db, "scores"), {
        testType: "test1",
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
    <View style={[styles.container]}>
      {readyText && (
        <>
          <Text style={styles.title}>Test 1 - Dominant Hand</Text>
          <Text style={styles.text}>Tap as soon as you see green</Text>

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
        <Text style={{ color: "white", fontSize: 30 }}>{time}ms</Text>
      )}

      {nextTestButton && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/results");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Next Test</Text>
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
