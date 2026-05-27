import { globalStyles } from "@/app/Styles/globalStyles";
import { auth, getLeaderboardDocs } from "@/firebase";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
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
    <ScrollView testID="results" style={globalStyles.container}>
      <Text style={globalStyles.title}>Leaderboards</Text>
      {/* TEST 1 */}
      <View style={globalStyles.colContainer}>
        <Text style={globalStyles.header}>Test 1 - Dominant Hand</Text>

        {test1Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                globalStyles.rowContainer,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={globalStyles.text}>#{index + 1}</Text>

              <Text style={globalStyles.text}>{user.email}</Text>

              <Text style={globalStyles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 2 */}
      <View style={globalStyles.colContainer}>
        <Text style={globalStyles.header}>Test 2 - Non Dominant Hand</Text>

        {test2Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                globalStyles.rowContainer,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={globalStyles.text}>#{index + 1}</Text>

              <Text style={globalStyles.text}>{user.email}</Text>

              <Text style={globalStyles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 3 */}
      <View style={globalStyles.colContainer}>
        <Text style={globalStyles.header}>Test 3 - Tracking</Text>

        {test3Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                globalStyles.rowContainer,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={globalStyles.text}>#{index + 1}</Text>

              <Text style={globalStyles.text}>{user.email}</Text>

              <Text style={globalStyles.text}>{user.score} clicks</Text>
            </View>
          );
        })}
      </View>

      {/* TEST 4 */}
      <View style={globalStyles.colContainer}>
        <Text style={globalStyles.header}>Test 4 - Audio Reaction</Text>

        {test4Scores.map((user, index) => {
          const isCurrentUser = user.userId === currentUser?.uid;

          return (
            <View
              key={user.id}
              style={[
                globalStyles.rowContainer,
                isCurrentUser && {
                  backgroundColor: "orange",
                  borderRadius: 10,
                },
              ]}
            >
              <Text style={globalStyles.text}>#{index + 1}</Text>

              <Text style={globalStyles.text}>{user.email}</Text>

              <Text style={globalStyles.text}>{user.score} ms</Text>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("./menu")}
      >
        <Text style={globalStyles.text}>Back To Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={globalStyles.text}>Change User</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
