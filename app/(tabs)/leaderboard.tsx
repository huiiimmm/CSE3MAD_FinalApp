import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InfoScreen() {
  return (
    <View style={styles.colContainer}>
      <Text style={styles.header}>Leaderboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  colContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },

  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    width: 220,
  },
});
