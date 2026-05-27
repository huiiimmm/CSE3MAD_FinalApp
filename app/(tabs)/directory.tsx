import { globalStyles } from "@/app/Styles/globalStyles";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MenuScreen() {
  return (
    <View testID="menu" style={globalStyles.container}>
      <Text style={globalStyles.title}>All Tests</Text>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./test1");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>
          Test 1 - Dominant Hand Reaction
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./test2");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>
          Test 2 - Non Dominant Hand Reaction
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./test3");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>
          Test 3 - Tracking and Accuracy
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => {
          router.push("./test4");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={globalStyles.buttonText}>
          Test 4 - Auditory Reaction Response
        </Text>
      </TouchableOpacity>
    </View>
  );
}
