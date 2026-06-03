import { auth } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function StretchTestMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const user = auth.currentUser;

  // Fallback state if no user context is detected
  // login bypass
  // if (!auth.currentUser) {
  //   return (
  //     <View
  //       style={[
  //         styles.container,
  //         { justifyContent: "center", paddingHorizontal: 20 },
  //       ]}
  //     >
  //       <Text style={styles.title}>Access Denied</Text>
  //       <Text style={styles.text}>
  //         Please log in to capture or analyze stretch telemetries.
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <View
      testID="menu"
      style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}
    >
      <Text style={styles.title}>Stretch Tests</Text>
      <Text style={[styles.text, { color: "gray", marginBottom: 20 }]}>
        Analyze stability, movement fluidity, and physical range of motion
        parameters.
      </Text>

      <View style={styles.colContainer}>
        {/* Core Test Sequence Option */}
        <TouchableOpacity
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/StretchTest/stretch_test");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start New Test</Text>
        </TouchableOpacity>

        {/* Database Telemetry History Option */}
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
            router.push("/StretchTest/stretch_results");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text
            style={[
              styles.buttonText,
              theme.card ? { color: theme.text } : { color: "#fff" },
            ]}
          >
            View Historical Results
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
