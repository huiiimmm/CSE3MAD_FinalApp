import { auth, getUserBestScores } from "@/firebase";
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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function MyResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<number | null>(null);
  const [test2Scores, setTest2Scores] = useState<number | null>(null);
  const [test3Scores, setTest3Scores] = useState<number | null>(null);
  const [test4Scores, setTest4Scores] = useState<number | null>(null);
  const user = auth.currentUser;

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;

        const userData = await getUserBestScores(user.uid);

        setTest1Scores(userData?.test1 ?? null);
        setTest2Scores(userData?.test2 ?? null);
        setTest3Scores(userData?.test3 ?? null);
        setTest4Scores(userData?.test4 ?? null);
      } catch (e) {
        console.error("Failed to load user historical reaction metrics:", e);
      }
    }

    loadData();
  }, [user]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={["top", "left", "right"]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: 16, paddingBottom: 30, paddingTop: 10 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Identity Display Block */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>
              {user?.email?.split("@")[0] ?? "User"}'s Personal Bests
            </Text>
            <Text
              style={[
                styles.text,
                { color: "gray", marginTop: 4, fontSize: 14 },
              ]}
            >
              Your top recorded metrics across all diagnostic evaluation
              modules.
            </Text>
          </View>

          {/* Grid Layout Row 1: Hand Reflex Speeds */}
          <View
            style={[
              styles.statsRow,
              { flexDirection: "row", width: "100%", marginBottom: 12 },
            ]}
          >
            <View
              style={[
                styles.statCard,
                {
                  borderLeftColor: "#4A90E2",
                  borderLeftWidth: 4,
                  flex: 1,
                  marginRight: 6,
                  padding: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardLabel,
                  { fontSize: 11, color: "gray", fontWeight: "600" },
                ]}
              >
                TEST 1: DOMINANT
              </Text>
              <Text
                testID="test1"
                style={[
                  styles.cardValue,
                  {
                    fontSize: 22,
                    fontWeight: "bold",
                    marginTop: 6,
                    color: theme.text,
                  },
                ]}
              >
                {test1Scores !== null ? `${test1Scores} ms` : "--"}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  borderLeftColor: "#9C27B0",
                  borderLeftWidth: 4,
                  flex: 1,
                  marginLeft: 6,
                  padding: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardLabel,
                  { fontSize: 11, color: "gray", fontWeight: "600" },
                ]}
              >
                TEST 2: NON-DOMINANT
              </Text>
              <Text
                testID="test2"
                style={[
                  styles.cardValue,
                  {
                    fontSize: 22,
                    fontWeight: "bold",
                    marginTop: 6,
                    color: theme.text,
                  },
                ]}
              >
                {test2Scores !== null ? `${test2Scores} ms` : "--"}
              </Text>
            </View>
          </View>

          {/* Grid Layout Row 2: Tracking Precision & Audio Cues */}
          <View
            style={[
              styles.statsRow,
              { flexDirection: "row", width: "100%", marginBottom: 12 },
            ]}
          >
            <View
              style={[
                styles.statCard,
                {
                  borderLeftColor: "#4CAF50",
                  borderLeftWidth: 4,
                  flex: 1,
                  marginRight: 6,
                  padding: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardLabel,
                  { fontSize: 11, color: "gray", fontWeight: "600" },
                ]}
              >
                TEST 3: TRACKING
              </Text>
              <Text
                testID="test3"
                style={[
                  styles.cardValue,
                  {
                    fontSize: 22,
                    fontWeight: "bold",
                    marginTop: 6,
                    color: theme.text,
                  },
                ]}
              >
                {test3Scores !== null ? `${test3Scores} Clicks` : "--"}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                {
                  borderLeftColor: "#FF9800",
                  borderLeftWidth: 4,
                  flex: 1,
                  marginLeft: 6,
                  padding: 12,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardLabel,
                  { fontSize: 11, color: "gray", fontWeight: "600" },
                ]}
              >
                TEST 4: AUDIO CUE
              </Text>
              <Text
                testID="test4"
                style={[
                  styles.cardValue,
                  {
                    fontSize: 22,
                    fontWeight: "bold",
                    marginTop: 6,
                    color: theme.text,
                  },
                ]}
              >
                {test4Scores !== null ? `${test4Scores} ms` : "--"}
              </Text>
            </View>
          </View>

          {/* Highlight Information Box */}
          <View
            style={[
              styles.dataCard,
              { width: "100%", marginTop: 12, padding: 16 },
            ]}
          >
            <View
              style={[
                styles.cardHeader,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.stretchTitle,
                  { fontWeight: "700", color: theme.text },
                ]}
              >
                Telemetry Context
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(74,144,226,0.1)",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={[
                    styles.metaLabel,
                    { fontSize: 11, color: "#4A90E2", fontWeight: "600" },
                  ]}
                >
                  Live Database
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "left",
                  fontSize: 13,
                  color: "gray",
                  marginTop: 8,
                  lineHeight: 18,
                },
              ]}
            >
              For millisecond (ms) reaction speeds, lower scores represent
              faster sensory processing. For tracking tests, higher score counts
              indicate greater accuracy and consistency.
            </Text>
          </View>

          {/* Return to Main Dashboard Actions */}
          <View style={[styles.colContainer, { width: "100%", marginTop: 24 }]}>
            <TouchableOpacity
              testID="menu"
              style={[
                styles.button,
                {
                  width: "100%",
                  height: 48,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/menu");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.buttonText}>Return to Menu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
