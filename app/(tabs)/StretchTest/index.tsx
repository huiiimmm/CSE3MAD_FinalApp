import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { TouchableOpacity, useColorScheme } from "react-native";

import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { auth } from "@/firebase";

export default function StretchTestMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to access Stretch Tests</Text>
      </View>
    );
  }
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
