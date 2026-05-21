import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from "react-native";

const { width, height } = useWindowDimensions();

export default function Test3() {
  const size = 50;

  const xAnim = useRef(new Animated.Value(width / 2 - size / 2)).current;
  const yAnim = useRef(new Animated.Value(height / 2 - size / 2)).current;

  const [startTest, setStartTest] = useState(false);

  const x = useRef(width / 2).current;
  const y = useRef(height / 2).current;

  const vx = useRef((Math.random() * 2 - 1) * 6).current;
  const vy = useRef((Math.random() * 2 - 1) * 6).current;

  const posX = useRef(x);
  const posY = useRef(y);

  const velX = useRef(vx);
  const velY = useRef(vy);

  useEffect(() => {
    if (!startTest) return;

    const interval = setInterval(() => {
      posX.current += velX.current;
      posY.current += velY.current;

      // Bounce X
      if (posX.current < 0 || posX.current > width - size) {
        velX.current *= -1;

        velX.current += (Math.random() - 0.5) * 2;
        velY.current = (Math.random() * 2 - 1) * 4;
      }

      // Bounce Y
      if (posY.current < 0 || posY.current > height - size) {
        velY.current *= -1;

        velY.current += (Math.random() - 0.5) * 2;
        velX.current = (Math.random() * 2 - 1) * 4;
      }

      xAnim.setValue(posX.current);
      yAnim.setValue(posY.current);
    }, 16);

    return () => clearInterval(interval);
  }, [startTest]);

  return (
    <View style={styles.container}>
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
    justifyContent: "center",
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
