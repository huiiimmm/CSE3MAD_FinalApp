import { auth, getLeaderboardDocs } from "@/firebase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<any[]>([]);
  const [test2Scores, setTest2Scores] = useState<any[]>([]);
  const [test3Scores, setTest3Scores] = useState<any[]>([]);
  const [test4Scores, setTest4Scores] = useState<any[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    try {
      // fastest reaction times
      getLeaderboardDocs("test1", setTest1Scores, true);

      getLeaderboardDocs("test2", setTest2Scores, true);

      getLeaderboardDocs("test4", setTest4Scores, true);

      // highest clicks
      getLeaderboardDocs("test3", setTest3Scores, false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <ScrollView testID="results" style={styles.container}>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.name}>Change User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    color: "#fff",
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
