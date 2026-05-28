import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
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

const scheme = useColorScheme();
const theme = scheme === "dark" ? darkTheme : lightTheme;
const styles = globalStyles(theme);

export default function MenuScreen() {
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
            router.push("./test1");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Start Test 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("./directory");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>All Tests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="leaderboard"
          style={styles.button}
          onPress={() => {
            router.push("./results");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("./map");
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.buttonText}>Change User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/myresults")}
        >
          <Text style={styles.buttonText}>My Results</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
