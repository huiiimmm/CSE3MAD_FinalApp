import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Test3() {
  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const size = 50; // ball size considerations for bounces
  const MIN_SPEED = 3;

  const randomVelocity = () => {
    const speed = Math.random() * 3 + MIN_SPEED; // always >= MIN_SPEED
    return Math.random() < 0.5 ? -speed : speed;
  };

  const [startTest, setStartTest] = useState(false);
  const xAnim = useRef(new Animated.Value(0)).current;
  const yAnim = useRef(new Animated.Value(0)).current;

  const posX = useRef(0);
  const posY = useRef(0);

  const velX = useRef((Math.random() * 2 - 1) * 6);
  const velY = useRef((Math.random() * 2 - 1) * 6);

  useEffect(() => {
    if (!startTest) return;

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
  }, [startTest]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const screenWidth = e.nativeEvent.layout.width;
        const screenHeight = e.nativeEvent.layout.height;

        setScreenWidth(screenWidth);
        setScreenHeight(screenHeight);

        const startX = screenWidth / 2 - size / 2;
        const startY = screenHeight / 2 - size / 2;

        // physics positions
        posX.current = startX;
        posY.current = startY;

        // animated positions
        xAnim.setValue(startX);
        yAnim.setValue(startY);
      }}
    >
      {startTest && (
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [{ translateX: xAnim }, { translateY: yAnim }],
            },
          ]}
        />
      )}
      {!startTest && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStartTest(true)}
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
  },

  ball: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "cyan",
  },

  button: {
    backgroundColor: "#4a90e2",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
