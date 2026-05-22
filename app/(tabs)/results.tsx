import { router } from "expo-router";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "./firebase";

export default function ResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<any[]>([]);
  const [test2Scores, setTest2Scores] = useState<any[]>([]);
  const [test3Scores, setTest3Scores] = useState<any[]>([]);
  const [test4Scores, setTest4Scores] = useState<any[]>([]);
  const currentUser = auth.currentUser;

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

    getLeaderboard("test4", setTest4Scores, true);

    // highest clicks
    getLeaderboard("test3", setTest3Scores, false);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leaderboards</Text>
      {/* TEST 1 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 1 - Dominant Hand</Text>

        {test1Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.row,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={styles.rank}>#{index + 1}</Text>

              <Text style={styles.name}>{user.email}</Text>

              <Text style={styles.score}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 2 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 2 - Non Dominant Hand</Text>

        {test2Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.row,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={styles.rank}>#{index + 1}</Text>

              <Text style={styles.name}>{user.email}</Text>

              <Text style={styles.score}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 3 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 3 - Tracking</Text>

        {test3Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.row,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={styles.rank}>#{index + 1}</Text>

              <Text style={styles.name}>{user.email}</Text>

              <Text style={styles.score}>{user.score} clicks</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 4 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test 4 - Audio Reaction</Text>

        {test4Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.row,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={styles.rank}>#{index + 1}</Text>

              <Text style={styles.name}>{user.email}</Text>

              <Text style={styles.score}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./menu")}
      >
        <Text style={styles.name}>Back To Menu</Text>
      </TouchableOpacity>
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
    color: "white",
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
    color: "white",
    fontSize: 18,
  },

  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: "center",
  },
});
