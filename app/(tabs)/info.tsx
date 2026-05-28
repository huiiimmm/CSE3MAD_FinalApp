import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { useColorScheme } from "react-native";

const scheme = useColorScheme();
const theme = scheme === "dark" ? darkTheme : lightTheme;
const styles = globalStyles(theme);
export default function InfoScreen() {
  return (
    <View testID="info" style={styles.container}>
      <Text style={styles.title}>Info Guide</Text>

      <Text style={styles.text}>This is a reaction testing app.</Text>

      <Text style={styles.text}>
        For the first test, tap the screen with your dominant hand as soon as
        the screen goes green.
      </Text>

      <Text style={styles.text}>
        The second test is the same as the first, but with your non-dominant
        hand.
      </Text>

      <Text style={styles.text}>
        For the third test, you must trace a moving object with your finger and
        tap it as many times as you can without missing.
      </Text>

      <Text style={styles.text}>
        For the last test, you must yell into the mic as soon as you hear a
        beep.
      </Text>

      <TouchableOpacity
        testID="startTest"
        style={styles.button}
        onPress={() => {
          router.push("/test1");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Start Test</Text>
      </TouchableOpacity>
    </View>
  );
}
