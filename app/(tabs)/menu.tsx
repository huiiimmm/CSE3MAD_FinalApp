import { globalStyles } from "@/app/Styles/globalStyles";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  return (
    <View testID="menu" style={globalStyles.container}>
      <Text style={globalStyles.title}>Reaction Tester</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./info");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./test1");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>Start Test 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./directory");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>All Tests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./results");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}
