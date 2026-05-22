import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { db } from "./firebase";

export default function ResultsScreen() {
  const [scores, setScores] = useState<any[]>([]);

  const getScores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "scores"));
      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setScores(results);
    } catch (error) {
      console.log(error);
    }
  };
  const test1Scores = scores.filter((score) => score.testType === "test1");

  const test2Scores = scores.filter((score) => score.testType === "test2");

  const test3Scores = scores.filter((score) => score.testType === "test3");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>

      {/* TEST 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 1 Scores</Text>

        {test1Scores.map((score) => (
          <Text key={score.id} style={styles.scoreText}>
            {score.reactionTime} ms
          </Text>
        ))}
      </View>

      {/* TEST 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 2 Scores</Text>

        {test2Scores.map((score) => (
          <Text key={score.id} style={styles.scoreText}>
            {score.reactionTime} ms
          </Text>
        ))}
      </View>

      {/* TEST 3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 3 Scores</Text>

        {test3Scores.map((score) => (
          <Text key={score.id} style={styles.scoreText}>
            {score.clicks} clicks
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  section: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#222",
    borderRadius: 12,
  },

  sectionTitle: {
    color: "cyan",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  scoreText: {
    color: "white",
    fontSize: 18,
    marginBottom: 6,
  },
});
