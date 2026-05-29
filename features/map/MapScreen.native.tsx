import { globalStyles } from "@/app/Styles/globalStyles";
import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";

import { getAllLocations, getUserBestScores, LocationData } from "@/firebase";

import * as Haptics from "expo-haptics";

import { router } from "expo-router";

import React, { useEffect, useState } from "react";

import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import MapView from "react-native-map-clustering";
import { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function MapScreen() {
  const scheme = useColorScheme();

  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const styles = globalStyles(theme);

  const [locations, setLocations] = useState<LocationData[]>([]);

  const [userScores, setUserScores] = useState<Record<string, any>>({});

  // LTU Bundoora
  const initialLatitude = -37.7217;
  const initialLongitude = 145.0479;

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const locationData = await getAllLocations();

        if (!mounted) return;

        setLocations(locationData);

        const scoreEntries = await Promise.all(
          locationData.map(async (loc) => {
            if (!loc.uid) return null;

            const scores = await getUserBestScores(loc.uid);

            return [loc.uid, scores] as [string, any];
          }),
        );

        if (!mounted) return;

        // load scores for every location user
        const validEntries = scoreEntries.filter(
          (entry): entry is [string, any] => entry !== null,
        );

        const scoreMap = Object.fromEntries(validEntries);

        setUserScores(scoreMap);
      } catch (e) {
        console.log(e);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

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
        clusterColor="#4A90E2"
        clusterTextColor="white"
        animationEnabled
      >
        {Array.from(
          new Map(locations.map((loc) => [loc.uid, loc])).values(),
        ).map((loc) => {
          const scores = userScores[loc.uid];
          return (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: loc.latitude,
                longitude: loc.longitude,
              }}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={{ color: "black" }}>{loc.email}</Text>

                  {scores && (
                    <>
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
          router.push("/menu");

          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Back to Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
