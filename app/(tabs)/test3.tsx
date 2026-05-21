import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Test3() {
  const xAnim = useRef(new Animated.Value(100)).current;
  const yAnim = useRef(new Animated.Value(100)).current;

  let x = 100;
  let y = 100;

  //random starting velocity
  let vx = (Math.random() - 0.5) * 12;
  let vy = (Math.random() - 0.5) * 12;

  const size = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      x += vx;
      y += vy;

      // bounce off walls
      if (x < 0 || x > width - size) {
        vx *= -1;
        // randomness after bounce
        vx += (Math.random() - 0.5) * 2;
      }
      if (y < 0 || y > height - size) {
        vy *= -1;
        // randomness after bounce
        vy += (Math.random() - 0.5) * 2;
      }
      xAnim.setValue(x);
      yAnim.setValue(y);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: 50,
          height: 50,
          borderRadius: size / 2,
          backgroundColor: "cyan",
          transform: [{ translateX: xAnim }, { translateY: yAnim }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "blue",
  },
});
