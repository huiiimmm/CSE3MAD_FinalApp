import { globalStyles } from "@/app/(tabs)/Styles/globalStyles";

import { darkTheme } from "@/app/(tabs)/Styles/Themes/dark";
import { lightTheme } from "@/app/(tabs)/Styles/Themes/light";
import { auth, getUserBestScores } from "@/firebase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function MyResultsScreen() {
  const [test1Scores, setTest1Scores] = useState<number | null>(null);
  const [test2Scores, setTest2Scores] = useState<number | null>(null);
  const [test3Scores, setTest3Scores] = useState<number | null>(null);
  const [test4Scores, setTest4Scores] = useState<number | null>(null);
  const user = auth.currentUser;

  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  useEffect(() => {
    async function loadData() {
      try {
        if (!user) return;

        const userData = await getUserBestScores(user.uid);

        setTest1Scores(userData.test1 ?? null);
        setTest2Scores(userData.test2 ?? null);
        setTest3Scores(userData.test3 ?? null);
        setTest4Scores(userData.test4 ?? null);
      } catch (e) {
        console.log(e);
      }
    }

    loadData();
  }, [user]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>
        {user?.email?.split("@")[0] ?? "User"}'s Best Scores
      </Text>
      {/* TEST 1 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 1 - Dominant Hand</Text>
        <View style={[styles.rowContainer, styles.highlightRow]}>
          <Text
            testID="test1"
            style={[styles.text, { textAlign: "center", width: "100%" }]}
          >
            {test1Scores}ms
          </Text>
        </View>
      </View>
      {/* TEST 2 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 2 - Non-Dominant Hand</Text>
        <View style={[styles.rowContainer, styles.highlightRow]}>
          <Text
            testID="test2"
            style={[styles.text, { textAlign: "center", width: "100%" }]}
          >
            {test2Scores}ms
          </Text>
        </View>
      </View>
      {/* TEST 3 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 3 - Tracking</Text>
        <View style={[styles.rowContainer, styles.highlightRow]}>
          <Text
            testID="test3"
            style={[styles.text, { textAlign: "center", width: "100%" }]}
          >
            {test3Scores} Total Clicks
          </Text>
        </View>
      </View>
      {/* TEST 4 */}
      <View style={styles.colContainer}>
        <Text style={styles.header}>Test 4 - Audio Reaction</Text>
        <View style={[styles.rowContainer, styles.highlightRow]}>
          <Text
            testID="test4"
            style={[styles.text, { textAlign: "center", width: "100%" }]}
          >
            {test4Scores}ms
          </Text>
        </View>
      </View>
      <TouchableOpacity
        testID="menu"
        style={styles.button}
        onPress={() => router.push("/(tabs)/ReactionTest/menu")}
      >
        <Text style={styles.buttonText}>Back To Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
