import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function MenuScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        testID="menu"
        style={[
          styles.container,
          { paddingHorizontal: 16, paddingTop: 30, paddingBottom: 20 },
        ]}
      >
        <Text style={styles.title}>Reaction Tester</Text>
        <Text style={[styles.text, { color: "gray", marginBottom: 10 }]}>
          Evaluate reflex parameters, track physical coordinates, and review
          historical scores.
        </Text>

        {/* Unified Dashboard Control Grid */}
        <View style={styles.colContainer}>
          {/* Primary Action Sequence */}
          <TouchableOpacity
            testID="startTest"
            style={[styles.button, { width: "100%" }]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/test1");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Quick Start (Test 1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { width: "100%", marginTop: 4 }]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/directory");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>All Available Tests</Text>
          </TouchableOpacity>

          {/* Analytical & Mapping Sub-modules */}
          <TouchableOpacity
            testID="leaderboard"
            style={[
              styles.button,
              {
                width: "100%",
                marginTop: 4,
                backgroundColor: theme.card || "#4A90E2",
              },
            ]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/results");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                theme.card ? { color: theme.text } : { color: "#fff" },
              ]}
            >
              Global Leaderboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                width: "100%",
                marginTop: 4,
                backgroundColor: theme.card || "#4A90E2",
              },
            ]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/map");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text
              style={[
                styles.buttonText,
                theme.card ? { color: theme.text } : { color: "#fff" },
              ]}
            >
              View Analytics Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                width: "100%",
                marginTop: 4,
                backgroundColor: theme.card || "#4A90E2",
              },
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
              My Personal Results
            </Text>
          </TouchableOpacity>

          {/* System & Configuration Options */}
          <View
            style={[
              styles.rowContainer,
              { marginTop: 20, borderWidth: 1, borderRadius: 10, padding: 12 },
            ]}
          >
            <TouchableOpacity
              testID="info"
              style={{ flex: 1, alignItems: "center" }}
              onPress={() => {
                router.push("./info");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 16, fontWeight: "600", color: "#4A90E2" },
                ]}
              >
                Info Guide
              </Text>
            </TouchableOpacity>

            <View
              style={{
                width: 1,
                height: 20,
                backgroundColor: theme.border || "#ccc",
              }}
            />

            <TouchableOpacity
              style={{ flex: 1, alignItems: "center" }}
              onPress={() => {
                router.push("/");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 16, fontWeight: "600", color: "#F44336" },
                ]}
              >
                Change User
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
