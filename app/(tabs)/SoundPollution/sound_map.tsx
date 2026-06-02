import { getSoundLocation, LocationData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import MapView from "react-native-map-clustering";
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";

// Helper to filter markers by color based on noise/decibel levels
const getMarkerColor = (noiseLevel?: number): string => {
  if (noiseLevel === undefined || noiseLevel === null || isNaN(noiseLevel)) {
    return "#9E9E9E"; // Grey if data is missing
  }
  if (noiseLevel < 55) return "#4CAF50"; // Quiet -> Green
  if (noiseLevel < 75) return "#FF9800"; // Moderate -> Orange
  return "#F44336"; // Loud -> Red
};

export default function MapScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [decibelScores, setDecibelScores] = useState<Record<string, any>>({});

  // LTU Bundoora Coordinates
  const initialLatitude = -37.7217;
  const initialLongitude = 145.0479;

  // Deduplicate locations safely using useMemo so it doesn't recalculate on every render
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

  /**
   * Calculates the average noise level of markers within a cluster
   * and assigns the corresponding noise color dynamically.
   */
  const renderClusterProperties = (cluster: any) => {
    const leaves = cluster.properties.cluster_id ? cluster.leaves : [];

    let totalNoise = 0;
    let validCount = 0;

    leaves.forEach((leaf: any) => {
      const level = leaf.properties?.noiseLevel;
      if (level !== undefined && level !== null) {
        totalNoise += level;
        validCount++;
      }
    });

    const averageNoise = validCount > 0 ? totalNoise / validCount : 0;
    const clusterColor = getMarkerColor(averageNoise);

    return {
      clusterColor,
    };
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        clusterTextColor="white"
        animationEnabled
        // Safe injection bypasses the missing/mismatched TypeScript overload types in older map-clustering declaration files
        {...({ calculateClusterProps: renderClusterProperties } as any)}
      >
        {uniqueLocations.map((loc) => {
          const scores = decibelScores[loc.uid];
          // Use matching loc.noiseLevel for the pin configuration colors
          const pinColor = getMarkerColor(loc.noiseLevel);

          return (
            <Marker
              key={loc.uid}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
              pinColor={pinColor}
              // Passed exactly as noiseLevel so the cluster leaf parsing works flawlessly
              // @ts-ignore
              noiseLevel={loc.noiseLevel}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {loc.email}
                  </Text>

                  {loc.noiseLevel !== undefined && loc.noiseLevel !== null && (
                    <Text style={{ color: "black", marginBottom: 6 }}>
                      Noise Level: {loc.noiseLevel} dB{" "}
                      {loc.noiseType ? `(${loc.noiseType})` : ""}
                    </Text>
                  )}

                  {scores ? (
                    <>
                      <Text
                        style={{ color: "gray", fontSize: 12, marginBottom: 2 }}
                      >
                        Best Reaction Scores:
                      </Text>
                      <Text style={{ color: "black" }}>
                        Test 1: {scores.test1 ?? "N/A"} ms
                      </Text>
                      <Text style={{ color: "black" }}>
                        Test 2: {scores.test2 ?? "N/A"} ms
                      </Text>
                      <Text style={{ color: "black" }}>
                        Test 3: {scores.test3 ?? "N/A"} clicks
                      </Text>
                      <Text style={{ color: "black" }}>
                        Test 4: {scores.test4 ?? "N/A"} ms
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: "gray", fontStyle: "italic" }}>
                      No score data available
                    </Text>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push("/(tabs)/ReactionTest/menu");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
