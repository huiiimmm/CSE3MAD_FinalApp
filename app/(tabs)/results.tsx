import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { auth, getLeaderboardDocs } from "@/firebase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function ResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<any[]>([]);
  const [test2Scores, setTest2Scores] = useState<any[]>([]);
  const [test3Scores, setTest3Scores] = useState<any[]>([]);
  const [test4Scores, setTest4Scores] = useState<any[]>([]);
  const currentUser = auth.currentUser;
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

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
    <ScrollView
      testID="results"
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Leaderboards</Text>

      {/* TEST 1 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 1 - Dominant Hand</Text>

        {test1Scores.map((user: any, index: number) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.rowContainer,
                isCurrentUser && styles.highlightRow,
              ]}
            >
              <Text style={styles.text}>#{index + 1}</Text>
              <Text style={styles.text}>{user.email}</Text>
              <Text style={styles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 2 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 2 - Non Dominant Hand</Text>

        {test2Scores.map((user: any, index: number) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.rowContainer,
                isCurrentUser && styles.highlightRow,
              ]}
            >
              <Text style={styles.text}>#{index + 1}</Text>
              <Text style={styles.text}>{user.email}</Text>
              <Text style={styles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 3 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 3 - Tracking</Text>

        {test3Scores.map((user: any, index: number) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.rowContainer,
                isCurrentUser && styles.highlightRow,
              ]}
            >
              <Text style={styles.text}>#{index + 1}</Text>
              <Text style={styles.text}>{user.email}</Text>
              <Text style={styles.text}>{user.score} clicks</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 4 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 4 - Audio Reaction</Text>

        {test4Scores.map((user: any, index: number) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                styles.rowContainer,
                isCurrentUser && styles.highlightRow,
              ]}
            >
              <Text style={styles.text}>#{index + 1}</Text>
              <Text style={styles.text}>{user.email}</Text>
              <Text style={styles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        testID="menu"
        style={styles.button}
        onPress={() => router.push("/menu")}
      >
        <Text style={styles.buttonText}>Back To Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="changeUser"
        style={styles.button}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.buttonText}>Change User</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/myresults")}
      >
        <Text style={styles.buttonText}>My Results</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
