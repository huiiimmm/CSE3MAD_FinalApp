import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>Reaction Tester</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("./info");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("./test1");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("./results");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: "#fff",
  },

  title: {
    color: "white",
    fontSize: 36,
    marginBottom: 40,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    color: "white",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
