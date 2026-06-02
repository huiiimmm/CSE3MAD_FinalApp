import { auth } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function EarthquakeResistanceMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

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
          Please log in to execute or evaluate structural seismic response
          simulations.
        </Text>
      </View>
    );
  }

  return (
    <View
      testID="menu"
      style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}
    >
      <Text style={styles.title}>Earthquake Resistance Tests</Text>
      <Text style={[styles.text, { color: "gray", marginBottom: 20 }]}>
        Simulate real-time tectonic waveforms and analyze structural integrity
        against seismic acceleration thresholds.
      </Text>

      <View style={styles.colContainer}>
        {/* Active Structural Waveform Simulator Route */}
        <TouchableOpacity
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/EarthquakeResistance/earthquake_simulator");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start Simulation</Text>
        </TouchableOpacity>

        {/* Database Seismic Telemetry History Route */}
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
            router.push("/EarthquakeResistance/earthquake_results"); // Links to your structural telemetry data table view
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              theme.card ? { color: theme.text } : { color: "#fff" },
            ]}
          >
            View Structural Telemetry
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
