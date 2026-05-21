import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  reactionTime: number;
};

export default function ResultsScreen({ reactionTime }: Props) {
  return (
    <View style={styles.colContainer}>
      <Text style={styles.header}>Results</Text>
      <Text>{reactionTime} ms</Text>
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
