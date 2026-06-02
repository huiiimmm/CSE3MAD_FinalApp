import { globalStyles } from "@/Styles/globalStyles";
import { Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

export const WebMapScreen = () => {
  const styles = globalStyles({});
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, textAlign: "center", marginTop: 20 }}>
        Sound Pollution Map is not available on web. Please use a mobile device
        to access this feature.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/SoundPollution")}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
};
