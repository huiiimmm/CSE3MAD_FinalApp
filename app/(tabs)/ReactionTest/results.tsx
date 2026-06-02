import { auth, getLeaderboardDocs } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
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
      // Fastest response speed records (Lower numbers win)
      getLeaderboardDocs("test1", setTest1Scores, true);
      getLeaderboardDocs("test2", setTest2Scores, true);
      getLeaderboardDocs("test4", setTest4Scores, true);

      // Highest tracking point accumulations (Higher numbers win)
      getLeaderboardDocs("test3", setTest3Scores, false);
    } catch (error) {
      console.error("Error connecting to leaderboard tables:", error);
    }
  }, []);

  // Shared reusable row rendering matrix to enforce clean alignment metrics
  const renderLeaderboardRows = (scores: any[], unit: string) => {
    if (scores.length === 0) {
      return (
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "center", padding: 12 },
          ]}
        >
          <Text style={[styles.text, { color: "gray", fontSize: 14 }]}>
            No telemetry scores logged yet
          </Text>
        </View>
      );
    }

    return scores.map((user: any, index: number) => {
      const isCurrentUser = user.userId === currentUser?.uid;
      const parsedUsername = user.email
        ? user.email.split("@")[0]
        : "Anonymous";

      return (
        <View
          key={user.id || index}
          style={[
            styles.rowContainer,
            {
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.border || "#eee",
            },
            isCurrentUser && {
              backgroundColor: theme.card || "rgba(74, 144, 226, 0.15)",
              borderRadius: 6,
            },
          ]}
        >
          {/* Rank Position */}
          <Text
            style={[
              styles.text,
              {
                width: "15%",
                fontWeight: "700",
                color: isCurrentUser ? "#4A90E2" : theme.text,
              },
            ]}
          >
            #{index + 1}
          </Text>

          {/* Sanitized User Profile Domain */}
          <Text
            style={[
              styles.text,
              { width: "55%", textAlign: "left" },
              isCurrentUser && { fontWeight: "700" },
            ]}
            numberOfLines={1}
          >
            {parsedUsername}
          </Text>

          {/* Extracted Score Parameter */}
          <Text
            style={[
              styles.text,
              {
                width: "30%",
                textAlign: "right",
                fontWeight: "bold",
                color: isCurrentUser ? "#4A90E2" : theme.text,
              },
            ]}
          >
            {user.score} {unit}
          </Text>
        </View>
      );
    });
  };

  return (
    <ScrollView
      testID="results"
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: 16, paddingBottom: 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Leaderboards</Text>
      <Text
        style={[styles.text, { color: "gray", marginBottom: 15, fontSize: 14 }]}
      >
        Global rankings and structural telemetry thresholds achieved across our
        testing ecosystem.
      </Text>

      {/* TEST 1 PODIUM */}
      <View style={[styles.colContainer, { marginBottom: 20 }]}>
        <Text style={styles.header}>Test 1 - Dominant Hand</Text>
        <View style={{ width: "100%", marginTop: 4 }}>
          {renderLeaderboardRows(test1Scores, "ms")}
        </View>
      </View>

      {/* TEST 2 PODIUM */}
      <View style={[styles.colContainer, { marginBottom: 20 }]}>
        <Text style={styles.header}>Test 2 - Non-Dominant Hand</Text>
        <View style={{ width: "100%", marginTop: 4 }}>
          {renderLeaderboardRows(test2Scores, "ms")}
        </View>
      </View>

      {/* TEST 3 PODIUM */}
      <View style={[styles.colContainer, { marginBottom: 20 }]}>
        <Text style={styles.header}>Test 3 - Tracking Fluidity</Text>
        <View style={{ width: "100%", marginTop: 4 }}>
          {renderLeaderboardRows(test3Scores, "pts")}
        </View>
      </View>

      {/* TEST 4 PODIUM */}
      <View style={[styles.colContainer, { marginBottom: 25 }]}>
        <Text style={styles.header}>Test 4 - Audio Cue Response</Text>
        <View style={{ width: "100%", marginTop: 4 }}>
          {renderLeaderboardRows(test4Scores, "ms")}
        </View>
      </View>

      {/* Secondary Dynamic Routing Buttons Layout Grid */}
      <View style={[styles.colContainer, { gap: 10 }]}>
        <TouchableOpacity
          testID="menu"
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/menu");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Return to Dashboard Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { width: "100%", backgroundColor: theme.card || "#4A90E2" },
          ]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/myresults");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              theme.card ? { color: theme.text } : { color: "#fff" },
            ]}
          >
            My Personal Bests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="changeUser"
          style={[
            styles.button,
            {
              width: "100%",
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#F44336",
            },
          ]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Text style={[styles.buttonText, { color: "#F44336" }]}>
            Swap Active Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
