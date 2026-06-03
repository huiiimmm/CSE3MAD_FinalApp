import { auth } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function SoundPollutionMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const user = auth.currentUser;

  // Secure auth guard fallback
  if (!auth.currentUser) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", paddingHorizontal: 20 },
        ]}
      >
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.text}>
          Please log in to record environmental noise samples.
        </Text>
      </View>
    );
  }

  return (
    <View
      testID="menu"
      style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}
    >
      <Text style={styles.title}>Sound Pollution Tests</Text>
      <Text style={[styles.text, { color: "gray", marginBottom: 20 }]}>
        Measure and map decibel frequencies in your local surroundings to track
        noise exposure.
      </Text>

      <View style={styles.colContainer}>
        {/* Active Decibel Sensor Recorder Route */}
        <TouchableOpacity
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/SoundPollution/pollution_test");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>

        {/* Global Cluster Map View Route */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: "100%",
              marginTop: 12,
              backgroundColor: theme.card || "#4A90E2",
            },
          ]}
          onPress={() => {
            router.push("/SoundPollution/sound_map"); // Links to your interactive marker cluster map
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              theme.card ? { color: theme.text } : { color: "#fff" },
            ]}
          >
            View Sound Map Data
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
