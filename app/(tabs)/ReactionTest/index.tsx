import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { globalStyles } from "@/Styles/globalStyles";
import { useColorScheme } from "react-native";

import { auth } from "@/firebase";

export default function ReactionTestIndex() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  const router = useRouter();

  const handleGoHome = () => {
    // Navigates directly back to the absolute root main index page
    router.replace("/" as any);
  };

  if (!auth.currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to access Reaction Tests</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reaction Test Home</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Back to Main App Home</Text>
      </TouchableOpacity>
    </View>
  );
}
