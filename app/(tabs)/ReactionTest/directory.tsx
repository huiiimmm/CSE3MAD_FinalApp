import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function DirectoryScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  return (
    <View
      testID="menu"
      style={[styles.container, { paddingHorizontal: 16, paddingTop: 40 }]}
    >
      <Text style={styles.title}>All Tests</Text>
      <Text style={[styles.text, { color: "gray", marginBottom: 10 }]}>
        Select a custom motor response or assessment submodule below.
      </Text>

      {/* Centralized Grid Wrapper */}
      <View style={styles.colContainer}>
        {/* Test 1 - Dominant Hand */}
        <TouchableOpacity
          testID="test1"
          style={[styles.button, { width: "100%" }]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/test1");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Test 1 - Dominant Hand Reaction</Text>
        </TouchableOpacity>

        {/* Test 2 - Non Dominant Hand */}
        <TouchableOpacity
          style={[styles.button, { width: "100%", marginTop: 4 }]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/test2");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>
            Test 2 - Non Dominant Hand Reaction
          </Text>
        </TouchableOpacity>

        {/* Test 3 - Tracking & Accuracy */}
        <TouchableOpacity
          style={[styles.button, { width: "100%", marginTop: 4 }]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/test3");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Test 3 - Tracking and Accuracy</Text>
        </TouchableOpacity>

        {/* Test 4 - Auditory Response */}
        <TouchableOpacity
          style={[styles.button, { width: "100%", marginTop: 4 }]}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/test4");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>
            Test 4 - Auditory Reaction Response
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
