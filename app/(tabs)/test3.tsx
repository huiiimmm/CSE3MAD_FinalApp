import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// const { height } = Dimensions.get("window");

export default function Test3() {
  const [x, setX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setX((prev) => prev + 5);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ball,
          {
            transform: [{ translateX: x }],
          },
        ]}
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
