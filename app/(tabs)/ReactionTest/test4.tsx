import { auth, saveReactionScore } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function Test4() {
  const [time, setTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [readyText, setReadyText] = useState(true);
  const [nextTestButton, setNextTestButton] = useState(false);

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const user = auth.currentUser;

  const intervalRef = useRef<any>(null);
  const detectionInterval = useRef<any>(null);
  const startRef = useRef<any>(null);

  const soundRef = useRef<Audio.Sound | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  // Global thread lockers
  const recordingLock = useRef(false);
  const timerLock = useRef(false);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/features/audio/beep-07a.mp3"),
        { shouldPlay: false, volume: 1.0 },
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Failed to mount asset sound buffer source:", error);
    }
  };

  const startRandomTimer = async () => {
    const delay = Math.random() * 8000 + 2000;
    await loadSound();

    setTimeout(async () => {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
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

  const detectSound = async () => {
    if (recordingLock.current) return;
    recordingLock.current = true;

    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
        await new Promise((res) => setTimeout(res, 200)); // Native audio hardware engine cooling buffer delay
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

        // Decibel threshold evaluation window match point
        if (status.metering > -20) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          stopTimer();

          if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
          }

          await stopRecording();
          setNextTestButton(true);
          recordingLock.current = false;
        }
      }, 80);
    } catch (e) {
      console.error("Audio core decibel parsing failure:", e);
      recordingLock.current = false;
    }
  };

  const stopTimer = () => {
    timerLock.current = false;
    if (startRef.current) {
      const duration = Date.now() - startRef.current;
      setReactionTime(duration);
      setTime(duration);
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
      console.error("Failed to unload recording hardware gracefully:", e);
    }
  };

  const saveTestScore = async () => {
    try {
      // login bypass
      // if (!user) return;
      const scores = {
        testType: "test4",
        userId: user?.uid,
        email: user?.email,
        reactionScore: reactionTime,
        timestamp: Date.now(),
      };
      await saveReactionScore(user, scores);
      console.log("Audio latency score saved successfully!");
    } catch (error) {
      console.error("Error committing score down to cloud ledger:", error);
    }
  };

  useEffect(() => {
    if (nextTestButton && reactionTime > 0) {
      saveTestScore();
    }
  }, [nextTestButton, reactionTime]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      stopRecording();
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  return (
    <View
      testID="test4"
      style={[
        styles.container,
        { paddingHorizontal: 16, justifyContent: "center" },
      ]}
    >
      <View
        style={[styles.colContainer, { width: "100%", alignItems: "center" }]}
      >
        {readyText && (
          <>
            <Text style={styles.title}>Test 4 - Audio Cue Reaction</Text>
            <Text
              style={[
                styles.text,
                { marginBottom: 25, opacity: 0.8, textAlign: "center" },
              ]}
            >
              Press start, then immediately snap or produce a distinct sound
              vocalization when the system cue tone triggers.
            </Text>

            <TouchableOpacity
              style={[styles.button, { width: "100%" }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setReadyText(false);
                startRandomTimer();
              }}
            >
              <Text style={styles.buttonText}>Initialize Test</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Real-time Processing Feed Display */}
        {!readyText && !nextTestButton && (
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.text,
                { fontSize: 16, color: "gray", marginBottom: 8 },
              ]}
            >
              LISTENING FOR INPUT ACCELERATION...
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 28, fontWeight: "bold", color: theme.text },
              ]}
            >
              {time} ms
            </Text>
          </View>
        )}

        {/* Final Outbound Diagnostics & Complete Navigation Tree */}
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
                FINAL ACOUSTIC LATENCY
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
                Acoustic telemetry data synced with global leaderboards!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { width: "100%" }]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/results");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.buttonText}>View Leaderboards</Text>
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
