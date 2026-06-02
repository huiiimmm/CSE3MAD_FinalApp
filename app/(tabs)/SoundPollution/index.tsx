import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { TouchableOpacity, useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { router } from "expo-router";

import { auth } from "@/firebase";
import React from "react";
import { Text, View } from "react-native";

export default function SoundPollutionMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Please log in to access Sound Pollution Tests
        </Text>
      </View>
    );
  }
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>Sound Pollution Tests</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/SoundPollution/pollution_test");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );
}
