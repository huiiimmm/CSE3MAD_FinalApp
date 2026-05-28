import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { useColorScheme } from "react-native";

const scheme = useColorScheme();
const theme = scheme === "dark" ? darkTheme : lightTheme;
const styles = globalStyles(theme);

import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function DirectoryScreen() {
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>All Tests</Text>

      <TouchableOpacity
        testID="test1"
        style={styles.button}
        onPress={() => {
          router.push("/test1");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Test 1 - Dominant Hand Reaction</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/test2");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>
          Test 2 - Non Dominant Hand Reaction
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/test3");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Test 3 - Tracking and Accuracy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/test4");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>
          Test 4 - Auditory Reaction Response
        </Text>
      </TouchableOpacity>
    </View>
  );
}
