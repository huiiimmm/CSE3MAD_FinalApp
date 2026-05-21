import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info Guide</Text>

      <Text style={styles.text}>This is a reaction testing app.</Text>

      <Text style={styles.text}>
        For the first test, tap the screen with your dominant hand as soon as
        the screen goes green.
      </Text>

      <Text style={styles.text}>
        The second test is the same as the first, but with your non-dominant
        hand.
      </Text>

      <Text style={styles.text}>
        For the last test, you must trace a moving object with your finger
        pressed on the screen.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/test1")}
      >
        <Text style={styles.buttonText}>Start Test</Text>
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
  },

  title: {
    color: "white",
    fontSize: 32,
    marginBottom: 30,
    fontWeight: "bold",
  },

  text: {
    color: "white",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
