import { auth } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function ReactionTestIndex() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const router = useRouter();

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/" as any);
  };

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
          Please log in to participate in reflex and attention assessments.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}>
      <Text style={styles.title}>Reaction Test Home</Text>
      <Text style={[styles.text, { color: "gray", marginBottom: 20 }]}>
        Measure, log, and monitor split-second sensory motor responses and
        tracking milestones.
      </Text>

      <View style={styles.colContainer}>
        {/* Primary Action: Proceed to the full Reaction Sub-Directory */}
        <TouchableOpacity
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/ReactionTest/menu" as any);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Explore Reaction Tests</Text>
        </TouchableOpacity>

        {/* Secondary Action: Return back to core ecosystem shell */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: "100%",
              marginTop: 12,
              backgroundColor: theme.card || "#4A90E2",
            },
          ]}
          onPress={handleGoHome}
        >
          <Text
            style={[
              styles.buttonText,
              theme.card ? { color: theme.text } : { color: "#fff" },
            ]}
          >
            Back to Main App Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
