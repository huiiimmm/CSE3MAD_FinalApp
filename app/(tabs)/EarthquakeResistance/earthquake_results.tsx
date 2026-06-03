import { getEarthquakeData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface EarthquakeRecord {
  id: string;
  uid: string;
  email: string;
  structureName?: string; // Captures custom structural tags saved in the document
  averageStructureMovementIntensity: number;
  peakStructureMovementIntensity: number;
  timestamp?: number;
}

export default function EarthquakeResults() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const [records, setRecords] = useState<EarthquakeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchMetrics = async () => {
    try {
      const data = await getEarthquakeData();
      // Cast and sort records to display highest peak intensity down to lowest
      const processedData = (data as EarthquakeRecord[]).sort(
        (a, b) =>
          b.peakStructureMovementIntensity - a.peakStructureMovementIntensity,
      );
      setRecords(processedData);
    } catch (error) {
      console.error("Error pulling seismographic record feeds:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  const renderRecordCard = ({
    item,
    index,
  }: {
    item: EarthquakeRecord;
    index: number;
  }) => {
    // Format numeric values to a safe display resolution of 2 decimal spaces
    const avgIntensity = Number(item.averageStructureMovementIntensity).toFixed(
      2,
    );
    const peakIntensity = Number(item.peakStructureMovementIntensity).toFixed(
      2,
    );

    return (
      <View
        style={[
          styles.dataCard,
          {
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderLeftWidth: 4,
            borderLeftColor: index === 0 ? "#FF9800" : "#4A90E2", // Gold highlighting for topmost severe structural profile
          },
        ]}
      >
        {/* Structure Header & Rank */}
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "space-between", alignItems: "flex-start" },
          ]}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text
              style={[
                styles.text,
                { fontWeight: "bold", color: theme.text, fontSize: 16 },
              ]}
              numberOfLines={1}
            >
              <Text testID="structureName1">
                {item.structureName || "Standard Test Frame"}
              </Text>
            </Text>
            <Text
              style={[
                styles.text,
                { fontSize: 12, color: "gray", marginTop: 2 },
              ]}
              numberOfLines={1}
            >
              Operator: {item.email || "Anonymous Profile"}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                scheme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  fontSize: 11,
                  fontWeight: "600",
                  color: index === 0 ? "#FF9800" : "gray",
                },
              ]}
            >
              Rank #{index + 1}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.border || "rgba(0,0,0,0.1)",
            marginVertical: 12,
          }}
        />

        {/* Intensity Metrics Row */}
        <View
          style={[styles.rowContainer, { justifyContent: "space-between" }]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.text,
                { fontSize: 11, color: "gray", fontWeight: "600" },
              ]}
            >
              AVG MOVEMENT
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  color: theme.text,
                  marginTop: 2,
                },
              ]}
            >
              {avgIntensity}
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={[
                styles.text,
                { fontSize: 11, color: "gray", fontWeight: "600" },
              ]}
            >
              PEAK INTENSITY
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  color: index === 0 ? "#FF9800" : "#F44336",
                  marginTop: 2,
                },
              ]}
            >
              {peakIntensity}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View
          style={[
            styles.container,
            { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
          ]}
        >
          {/* Dashboard Header Blocks */}
          <View
            style={[styles.colContainer, { width: "100%", marginBottom: 15 }]}
          >
            <Text style={styles.title}>Seismic Diagnostics</Text>
            <Text
              style={[
                styles.text,
                { color: "gray", fontSize: 13, marginTop: 4 },
              ]}
            >
              Telemetry log comparing peak structural distortion factors across
              historical structural checks.
            </Text>
          </View>

          {/* Core Data Layout Grid Conditional Tree */}
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={[styles.text, { marginTop: 10, color: "gray" }]}>
                Retrieving telemetry charts...
              </Text>
            </View>
          ) : (
            <FlatList
              data={records}
              keyExtractor={(item) => item.id}
              renderItem={renderRecordCard}
              style={{ width: "100%", flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshing={refreshing}
              onRefresh={handleManualRefresh}
              ListEmptyComponent={
                <View style={{ padding: 40, alignItems: "center" }}>
                  <Text
                    style={[
                      styles.text,
                      { color: "gray", textAlign: "center" },
                    ]}
                  >
                    No seismographic logging passes found. Complete an
                    assessment to stream metrics.
                  </Text>
                </View>
              }
            />
          )}

          {/* Anchor Bottom Control Interface System */}
          <View
            style={[
              styles.colContainer,
              { width: "100%", marginTop: 10, gap: 10 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { width: "100%", backgroundColor: theme.card || "#4A90E2" },
              ]}
              onPress={() => {
                router.push("/(tabs)/ReactionTest/directory");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  theme.card ? { color: theme.text } : { color: "#fff" },
                ]}
              >
                View All Tests
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: "100%",
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: theme.border || "#ccc",
                },
              ]}
              onPress={() => {
                router.push("//EarthquakeResistance/");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Back to Menu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
