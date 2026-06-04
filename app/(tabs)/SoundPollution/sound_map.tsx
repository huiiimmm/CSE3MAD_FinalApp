import { getSoundLocation, LocationData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import MapView from "react-native-map-clustering";
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const getMarkerColor = (noiseLevel?: number): string => {
  if (noiseLevel === undefined || noiseLevel === null || isNaN(noiseLevel)) {
    return "#9E9E9E";
  }
  if (noiseLevel < 60) return "#4CAF50";
  if (noiseLevel < 90) return "#FF9800";
  return "#F44336";
};

export default function MapScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const mapRef = useRef<any>(null); // Anchor reference to control map camera positions

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [decibelScores, setDecibelScores] = useState<Record<string, any>>({});

  const initialLatitude = -37.7217;
  const initialLongitude = 145.0479;

  const uniqueLocations = useMemo(() => {
    const uniqueMap = new Map(locations.map((loc) => [loc.uid, loc]));
    return Array.from(uniqueMap.values());
  }, [locations]);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const locationData = await getSoundLocation();
        if (!mounted) return;
        setLocations(locationData);
      } catch (e) {
        console.error("Error loading map data: ", e);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {/* Debug Banner - Safely tracks array length updates */}
      <Text
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 999,
          color: "red",
          fontWeight: "bold",
          backgroundColor: "rgba(255,255,255,0.8)",
          padding: 4,
        }}
      >
        Loaded Pins: {uniqueLocations.length}
      </Text>

      <MapView
        ref={mapRef}
        key={uniqueLocations.length}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, width: "100%", height: "100%" }}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        clusterTextColor="white"
        animationEnabled
      >
        {uniqueLocations.map((loc) => {
          const lat = Number(loc.latitude);
          const lng = Number(loc.longitude);

          // Skip rendering if data conversion results in invalid numbers
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={loc.uid}
              coordinate={{ latitude: lat, longitude: lng }}
              tracksViewChanges={true}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: getMarkerColor(loc.noiseLevel),
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 4,
                  elevation: 5,
                }}
              />
              <Callout>
                <View style={{ padding: 6, minWidth: 120 }}>
                  <Text style={{ color: "black", fontWeight: "bold" }}>
                    {loc.email}
                  </Text>
                  <Text style={{ color: "black" }}>
                    Noise: {loc.noiseLevel} dB
                  </Text>
                  <Text style={{ color: "black" }}>
                    Noise Source: {loc.noiseType}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity
        style={[
          styles.button,
          { position: "absolute", bottom: 30, left: 20, right: 20 },
        ]}
        onPress={() => router.push("/SoundPollution")}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
