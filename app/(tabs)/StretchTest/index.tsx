import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { TouchableOpacity, useColorScheme } from "react-native";

import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function StretchTestMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>Stretch Tests</Text>
      <View style={styles.colContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/StretchTest/stretch_test")}
        >
          <Text style={styles.buttonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
