import { globalStyles } from "@/app/(tabs)/Styles/globalStyles";

import { darkTheme } from "@/app/(tabs)/Styles/Themes/dark";
import { lightTheme } from "@/app/(tabs)/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function MenuScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  return (
    <ScrollView>
      <View testID="menu" style={styles.container}>
        <Text style={styles.title}>Reaction Tester</Text>

        <TouchableOpacity
          testID="info"
          style={styles.button}
          onPress={() => {
            router.push("./info");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="startTest"
          style={styles.button}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/test1");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start Test 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/directory");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>All Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="leaderboard"
          style={styles.button}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/results");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/(tabs)/ReactionTest/map");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/ReactionTest")}
        >
          <Text style={styles.buttonText}>Change User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/ReactionTest/myresults")}
        >
          <Text style={styles.buttonText}>My Results</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
