import { auth, saveScore } from "@/firebase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Test3() {
  const size = 50;
  const MIN_SPEED = 2;
  const user = auth.currentUser;

  const [time, setTime] = useState(10);
  const intervalRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const [startTest, setStartTest] = useState(false);
  const [stopTest, setStopTest] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const [clickCount, setClickCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  const xAnim = useRef(new Animated.Value(0)).current;
  const yAnim = useRef(new Animated.Value(0)).current;

  const posX = useRef(0);
  const posY = useRef(0);

  const velX = useRef(0);
  const velY = useRef(0);

  const randomVelocity = () => {
    const speed = Math.random() * 3 + MIN_SPEED;
    return Math.random() < 0.5 ? -speed : speed;
  };

  const startPhysics = () => {
    velX.current = randomVelocity();
    velY.current = randomVelocity();
  };

  useEffect(() => {
    if (!startTest || stopTest) return;
    if (screenWidth === 0 || screenHeight === 0) return;

    const interval = setInterval(() => {
      posX.current += velX.current;
      posY.current += velY.current;

      // Bounce X
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

      // Bounce Y
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

      xAnim.setValue(posX.current);
      yAnim.setValue(posY.current);
    }, 16);

    return () => clearInterval(interval);
  }, [startTest, stopTest, screenWidth, screenHeight]);

  const saveTestScore = async () => {
    try {
      if (!user) return;
      const scores = {
        testType: "test3",
        userId: user?.uid,
        email: user?.email,
        score: clickCount,
        timestamp: Date.now(),
      };
      saveScore(user, scores);
      console.log("score saved!");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (stopTest) {
      saveTestScore();
    }
  }, [stopTest]);

  return (
    <View
      testID="test3"
      style={styles.container}
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
      {!startTest && (
        <Text style={styles.buttonText}>
          Click the moving ball as many times as you can in 10 seconds without
          missing!
        </Text>
      )}
      <Text style={styles.buttonText}>Clicks: {clickCount}</Text>
      <Text style={styles.buttonText}>
        Accuracy:{" "}
        {totalClicks ? ((clickCount / totalClicks) * 100).toFixed(1) : 0}%
      </Text>
      <Pressable
        style={{ flex: 1 }}
        onPress={() => {
          if (stopTest) return;
          if (!startTest) return;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setClickCount((prev) => prev - 1);
          setTotalClicks((prev) => prev + 1);
        }}
      >
        {startTest && (
          <Text style={styles.buttonText}> {time > 0 ? time : "Stop!"}</Text>
        )}
        {startTest && (
          <Animated.View
            style={{
              position: "absolute",
              transform: [{ translateX: xAnim }, { translateY: yAnim }],
            }}
          >
            <Pressable
              onPress={() => {
                if (stopTest) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setClickCount((prev) => prev + 1);
                setTotalClicks((prev) => prev + 1);
              }}
              style={styles.ball}
            />
          </Animated.View>
        )}
      </Pressable>

      {stopTest && (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push("/test4");
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
      {!startTest && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setStartTest(true);
            startPhysics();
            countDown();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "white",
    color: "#fff",
  },

  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "cyan",
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
    marginBottom: 20,
    textAlign: "center",
  },
});
