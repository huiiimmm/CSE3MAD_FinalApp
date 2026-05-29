import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { useColorScheme } from "react-native";

import React from "react";
import { Text, View } from "react-native";

export default function StretchTestMain() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);
  return (
    <View testID="menu" style={styles.container}>
      <Text style={styles.title}>Stretch Tests</Text>
    </View>
  );
}
