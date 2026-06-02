import { getVibrationData } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

interface VibrationRecord {
  id: string;
  uid: string;
  email: string;
  movementType: string;
  movementDuration: number;
  averageMovementIntensity: number;
  peakMovementIntensity: number;
}

export default function VibrationResultsScreen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const [records, setRecords] = useState<VibrationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await getVibrationData();
      setRecords(data as VibrationRecord[]);
    } catch (error) {
      console.error("Failed to load vibration database snapshots:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const statsSummary = useMemo(() => {
    if (records.length === 0) return { totalSessions: 0, globalMaxPeak: 0 };

    const totalSessions = records.length;
    const globalMaxPeak = Math.max(
      ...records.map((r) => r.peakMovementIntensity || 0),
    );

    return {
      totalSessions,
      globalMaxPeak: parseFloat(globalMaxPeak.toFixed(3)),
    };
  }, [records]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={[styles.text, { marginTop: 10 }]}>
          Loading telemetry records...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: 16, paddingTop: 20 }]}>
      <Text style={styles.title}>Vibration & Stretch Review</Text>

      {/* Aggregate Scoreboard Summary Cards via globalStyles */}
      <View style={styles.statsRow}>
        <View
          style={[
            styles.statCard,
            { borderLeftColor: "#4A90E2", marginRight: 8 },
          ]}
        >
          <Text style={styles.cardLabel}>TOTAL STRETCHES</Text>
          <Text style={styles.cardValue}>{statsSummary.totalSessions}</Text>
        </View>

        <View
          style={[
            styles.statCard,
            { borderLeftColor: "#F44336", marginLeft: 8 },
          ]}
        >
          <Text style={styles.cardLabel}>HIGHEST PEAK FORCE</Text>
          <Text style={styles.cardValue}>{statsSummary.globalMaxPeak} G</Text>
        </View>
      </View>

      {/* Data Table List Layout */}
      {records.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={[styles.text, { color: "gray", fontStyle: "italic" }]}>
            No tracking records logged yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#4A90E2"
            />
          }
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.dataCard}>
              {/* Header: Stretch Type Label */}
              <View style={styles.cardHeader}>
                <Text style={styles.stretchTitle}>
                  {item.movementType || "Unknown Workout"}
                </Text>
                <Text style={[styles.metaLabel, { alignSelf: "center" }]}>
                  {item.movementDuration ? `${item.movementDuration}s` : "N/A"}
                </Text>
              </View>

              {/* Data Content Grid Breakdown */}
              <View style={styles.gridRow}>
                <View>
                  <Text style={styles.metaLabel}>SMOOTHNESS (AVG)</Text>
                  <Text style={[styles.metaValue, { color: theme.text }]}>
                    {item.averageMovementIntensity
                      ? `${item.averageMovementIntensity.toFixed(3)} G`
                      : "0.00 G"}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.metaLabel}>PEAK ROM IMPACT</Text>
                  <Text style={[styles.metaValue, { color: "#FF9800" }]}>
                    {item.peakMovementIntensity
                      ? `${item.peakMovementIntensity.toFixed(3)} G`
                      : "0.00 G"}
                  </Text>
                </View>
              </View>

              {/* Contributor User Attribution Tag */}
              <Text style={styles.attribution}>
                Logged by: {item.email || "Anonymous Team"}
              </Text>
            </View>
          )}
        />
      )}

      {/* Navigation Return Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { marginTop: 15, width: "100%", marginBottom: 10 },
        ]}
        onPress={() => {
          router.back();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.buttonText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
