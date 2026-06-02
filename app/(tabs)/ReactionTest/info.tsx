import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { globalStyles } from "@/Styles/globalStyles";
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

export default function InfoScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        testID="info"
        style={[
          styles.container,
          { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 },
        ]}
      >
        <Text style={styles.title}>Info Guide</Text>

        <Text
          style={[
            styles.text,
            { fontWeight: "600", marginBottom: 20, color: "#4A90E2" },
          ]}
        >
          Welcome to the Reaction Testing App.
        </Text>

        {/* Detailed Assessment Instructions List */}
        <View
          style={[
            styles.colContainer,
            { alignItems: "stretch", marginTop: 0, gap: 14 },
          ]}
        >
          <View style={styles.dataCard}>
            <Text style={styles.stretchTitle}>Test 1: Dominant Hand</Text>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "left",
                  fontSize: 15,
                  marginTop: 4,
                  color: theme.text,
                },
              ]}
            >
              Tap the screen with your dominant hand as soon as the background
              flashes green.
            </Text>
          </View>

          <View style={styles.dataCard}>
            <Text style={styles.stretchTitle}>Test 2: Non-Dominant Hand</Text>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "left",
                  fontSize: 15,
                  marginTop: 4,
                  color: theme.text,
                },
              ]}
            >
              Identical to the first assessment, but execute the touch sequence
              using your non-dominant hand.
            </Text>
          </View>

          <View style={styles.dataCard}>
            <Text style={styles.stretchTitle}>Test 3: Tracking & Accuracy</Text>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "left",
                  fontSize: 15,
                  marginTop: 4,
                  color: theme.text,
                },
              ]}
            >
              Trace the dynamically moving target across the interactive canvas
              area and tap it rapidly without missing.
            </Text>
          </View>

          <View style={styles.dataCard}>
            <Text style={styles.stretchTitle}>Test 4: Auditory Reaction</Text>
            <Text
              style={[
                styles.text,
                {
                  textAlign: "left",
                  fontSize: 15,
                  marginTop: 4,
                  color: theme.text,
                },
              ]}
            >
              Listen closely for the target audio cue tone and shout clearly
              into the microphone immediately upon hearing it.
            </Text>
          </View>
        </View>

        {/* Core CTA Forward Navigation Action */}
        <View style={[styles.colContainer, { marginTop: 25 }]}>
          <TouchableOpacity
            testID="startTest"
            style={[styles.button, { width: "100%" }]}
            onPress={() => {
              router.push("/(tabs)/ReactionTest/test1");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={styles.buttonText}>Begin Evaluations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
