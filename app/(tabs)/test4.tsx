import { globalStyles } from "@/app/Styles/globalStyles";
import { auth, saveScore } from "@/firebase";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

  // global locks
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

  // sound detection
  const detectSound = async () => {
    if (recordingLock.current) return;
    recordingLock.current = true;

    try {
      // cleanup
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
    <View testID="test4" style={globalStyles.container}>
      {readyText && (
        <>
          <Text style={globalStyles.title}>Test 4 - Sound Reaction</Text>

          <Text style={globalStyles.text}>
            Tap start, then react when you hear the sound or make a loud noise
          </Text>

          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setReadyText(false);
              startRandomTimer();
            }}
          >
            <Text style={globalStyles.buttonText}>Start</Text>
          </TouchableOpacity>
        </>
      )}

      {!readyText && (
        <Text style={{ color: "white", fontSize: 30 }}>{time} ms</Text>
      )}

      {nextTestButton && (
        <>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => {
              router.push("/results");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={globalStyles.buttonText}>Results</Text>
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
