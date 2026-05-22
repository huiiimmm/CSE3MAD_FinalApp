import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "./firebase";

export default function ResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<any[]>([]);
  const [test2Scores, setTest2Scores] = useState<any[]>([]);
  const [test3Scores, setTest3Scores] = useState<any[]>([]);

  const getLeaderboard = async (
    testType: string,
    setFunction: React.Dispatch<React.SetStateAction<any[]>>,
    ascending: boolean = false,
  ) => {
    try {
      const q = query(
        collection(db, "scores"),

        where("testType", "==", testType),

        orderBy("score", ascending ? "asc" : "desc"),

        limit(10),
      );

      const querySnapshot = await getDocs(q);

      const results: any[] = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setFunction(results);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // fastest reaction times
    getLeaderboard("test1", setTest1Scores, true);

    getLeaderboard("test2", setTest2Scores, true);

    // highest clicks
    getLeaderboard("test3", setTest3Scores, false);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leaderboards</Text>

      {/* TEST 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 1 - Dominant Hand</Text>

        {test1Scores.map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>

            <Text style={styles.name}>{user.email}</Text>

            <Text style={styles.score}>{user.score} ms</Text>
          </View>
        ))}
      </View>

      {/* TEST 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 2 - Non Dominant Hand</Text>

        {test2Scores.map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>

            <Text style={styles.name}>{user.email}</Text>

            <Text style={styles.score}>{user.score} ms</Text>
          </View>
        ))}
      </View>

      {/* TEST 3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 3 - Tracking</Text>

        {test3Scores.map((user, index) => (
          <View key={user.id} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>

            <Text style={styles.name}>{user.email}</Text>

            <Text style={styles.score}>{user.score} clicks</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
    textAlign: "center",
    marginBottom: 30,
  },

  section: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  sectionTitle: {
    color: "cyan",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  rank: {
    color: "gold",
    fontSize: 18,
    width: 50,
  },

  name: {
    color: "white",
    fontSize: 18,
    flex: 1,
  },

  score: {
    color: "cyan",
    fontSize: 18,
  },
});
