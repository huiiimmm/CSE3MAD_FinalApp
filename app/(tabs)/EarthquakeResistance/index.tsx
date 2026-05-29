import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { useColorScheme } from "react-native";

import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function EarthquakeResistanceMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>Earthquake Resistance Tests</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/EarthquakeResistance/earthquake_simulator");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );
}
