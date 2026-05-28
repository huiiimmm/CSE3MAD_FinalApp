import { globalStyles } from "@/app/Styles/globalStyles";
import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { getAllLocations } from "@/firebase";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Platform,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function MapScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  if (Platform.OS === "web") {
    return (
      <View>
        <Text>Maps are not supported on web</Text>
      </View>
    );
  }

  const MapView = require("react-native-maps").default;
  const { Marker } = require("react-native-maps");

  const [locations, setLocations] = useState<any[]>([]);
  const initialLatitude = -37.8136;
  const initialLongitude = 144.9631;

  useEffect(() => {
    async function loadLocations() {
      const locationData = await getAllLocations();
      setLocations(locationData);
    }
    loadLocations();
  }, []);
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
          />
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/menu");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
