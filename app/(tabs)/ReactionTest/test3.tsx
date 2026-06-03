import { auth, saveReactionScore } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function Test3() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const size = 50;
  const MIN_SPEED = 2;
  const user = auth.currentUser;

  const [time, setTime] = useState(10);
  const intervalRef = useRef<any>(null);

  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const xAnim = useRef(new Animated.Value(0)).current;
  const yAnim = useRef(new Animated.Value(0)).current;

  const posX = useRef(0);
  const posY = useRef(0);

  const velX = useRef(0);
  const velY = useRef(0);

  const countDown = () => {
    setTime(10);
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setStopTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const randomVelocity = () => {
    const speed = Math.random() * 3 + MIN_SPEED;
    return Math.random() < 0.5 ? -speed : speed;
  };

  const startPhysics = () => {
    velX.current = randomVelocity();
    velY.current = randomVelocity();
  };

  // Ball physics engine handler
  useEffect(() => {
    if (!startTest || stopTest) return;
    if (screenWidth === 0 || screenHeight === 0) return;

    const interval = setInterval(() => {
      // Bounce Horizontally
      if (posX.current < 0) {
        posX.current = 0;
        velX.current *= -1;
        velY.current = randomVelocity();
      }
      if (posX.current > screenWidth - size) {
        posX.current = screenWidth - size;
        velX.current *= -1;
        velY.current = randomVelocity();
      }

      // Bounce Vertically
      if (posY.current < 0) {
        posY.current = 0;
        velY.current *= -1;
        velX.current = randomVelocity();
      }
      if (posY.current > screenHeight - size) {
        posY.current = screenHeight - size;
        velY.current *= -1;
        velX.current = randomVelocity();
      }

      posX.current += velX.current;
      posY.current += velY.current;

      xAnim.setValue(posX.current);
      yAnim.setValue(posY.current);
    }, 16);

    return () => clearInterval(interval);
  }, [startTest, stopTest, screenWidth, screenHeight]);

  const saveTestScore = async () => {
    // Prevent duplicate uploads from firing during state updates
    // if (!user) return; // Login bypass
    if (isScoreSaved) return;

    try {
      setIsScoreSaved(true); // Lock the gate immediately before hitting network tasks

      const scores = {
        testType: "test3",
        userId: user?.uid,
        email: user?.email,
        reactionScore: Number(clickCount), // Force explicit numeric assignment
        timestamp: Date.now(),
      };

      await saveReactionScore(user, scores);
      console.log(
        `Tracking accuracy score (${clickCount} clicks) saved successfully!`,
      );
    } catch (error) {
      setIsScoreSaved(false); // Unlock the gate if the network write fails completely
      console.error("Error committing score down to cloud ledger:", error);
    }
  };

  // 2. Keep your listener clean
  useEffect(() => {
    if (stopTest && !isScoreSaved) {
      saveTestScore();
    }
  }, [stopTest, isScoreSaved]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const calculatedAccuracy = totalClicks
    ? ((clickCount / totalClicks) * 100).toFixed(1)
    : "0.0";

  return (
    <View
      testID="test3"
      style={[
        styles.container,
        { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
      ]}
    >
      {/* Upper Panel HUD Status Bar */}
      <View style={[styles.colContainer, { width: "100%", marginBottom: 10 }]}>
        {!startTest && !stopTest && (
          <>
            <Text style={styles.title}>Test 3 - Tracking Fluidity</Text>
            <Text style={[styles.text, { marginBottom: 15, color: "gray" }]}>
              Click the moving ball target accurately as many times as possible
              within a rolling 10-second window.
            </Text>
          </>
        )}

        {/* Live Score Metrics Dashboard */}
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "space-between", paddingHorizontal: 10 },
          ]}
        >
          <Text style={[styles.text, { fontWeight: "700" }]}>
            Hits: {clickCount}
          </Text>
          {startTest && (
            <Text
              testID="timer"
              style={[styles.text, { color: "#4A90E2", fontWeight: "700" }]}
            >
              Timer: {time}s
            </Text>
          )}
          <Text style={[styles.text, { fontWeight: "700" }]}>
            Accuracy: {calculatedAccuracy}%
          </Text>
        </View>
      </View>

      {/* Physics Bound Canvas Overlay Area */}
      <View
        style={[
          styles.bounceContainer,
          {
            flex: 1,
            width: "100%",
            borderWidth: 1,
            borderColor: theme.border || "#ccc",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: theme.card || "rgba(0,0,0,0.02)",
          },
        ]}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          const h = e.nativeEvent.layout.height;
          setScreenWidth(w);
          setScreenHeight(h);

          const startX = w / 2 - size / 2;
          const startY = h / 2 - size / 2;
          posX.current = startX;
          posY.current = startY;
          xAnim.setValue(startX);
          yAnim.setValue(startY);
        }}
      >
        <Pressable
          testID="background"
          style={{ flex: 1 }}
          onPress={() => {
            if (!startTest || stopTest) return;
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setClickCount((prev) => prev - 1);
            setTotalClicks((prev) => prev + 1);
          }}
        >
          {/* Pre-Start Canvas State Action CTA */}
          {!startTest && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <TouchableOpacity
                style={[styles.button, { width: "80%" }]}
                testID="startButton"
                onPress={() => {
                  setStartTest(true);
                  startPhysics();
                  countDown();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }}
              >
                <Text style={styles.buttonText}>Launch Canvas</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Active Fluid Animating Target Node */}
          {startTest && !stopTest && (
            <Animated.View
              style={{
                position: "absolute",
                transform: [{ translateX: xAnim }, { translateY: yAnim }],
              }}
            >
              <Pressable
                style={styles.ball}
                testID="ball"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setClickCount((prev) => prev + 1);
                  setTotalClicks((prev) => prev + 1);
                }}
              />
            </Animated.View>
          )}
        </Pressable>
      </View>

      {/* Post-Assessment Success View & Navigation Routes */}
      {stopTest && (
        <View style={[styles.colContainer, { width: "100%", marginTop: 15 }]}>
          <View
            style={[
              styles.dataCard,
              {
                width: "100%",
                padding: 16,
                marginBottom: 15,
                borderColor: "#4CAF50",
                borderWidth: 1,
              },
            ]}
          >
            <Text style={[styles.text, { fontSize: 13, color: "gray" }]}>
              TEST COMPLETION RATIO
            </Text>
            <Text
              style={[
                styles.title,
                { fontSize: 26, marginVertical: 4, color: theme.text },
              ]}
            >
              {clickCount} Point Hits
            </Text>
            <Text style={[styles.text, { fontSize: 13, color: "gray" }]}>
              Maintained an overall pinpoint accuracy metric of{" "}
              {calculatedAccuracy}%.
            </Text>
          </View>

          <TouchableOpacity
            testID="nextTest"
            style={[styles.button, { width: "100%" }]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/test4");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Proceed to Test 4</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                width: "100%",
                marginTop: 8,
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
                marginTop: 8,
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
  );
}
