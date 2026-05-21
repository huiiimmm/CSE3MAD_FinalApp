import { router } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function MenuScreen() {
  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.title}>Reaction Tester</Text>

      <Button title="Info" onPress={() => router.push("./info")} />

      <Button title="Start Test" onPress={() => router.push("./test1")} />

      <Button
        title="Leaderboard"
        onPress={() => router.push("./leaderboard")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    width: 220,
  },

  title: {
    color: "white",
    fontSize: 36,
    marginBottom: 40,
  },

  button: {
    width: 200,
    paddingVertical: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#4a90e2",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
