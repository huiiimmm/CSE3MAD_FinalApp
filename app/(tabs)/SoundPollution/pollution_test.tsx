import { auth, uploadSoundLocation } from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function SoundPollutionTest() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  const [noiseType, setNoiseType] = useState("");
  const [errorText, setErrorText] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = auth.currentUser;
  const meterIntervalRef = useRef<any>(null);

  const [decibels, setDecibels] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Clean up recording telemetry on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  const startMonitoring = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert(
          "Microphone permission is required to calculate noise pollution.",
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.LOW_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.LOW_QUALITY.android,
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.LOW_QUALITY.ios,
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MIN,
        },
      });

      setRecording(newRecording);
      setIsMonitoring(true);

      meterIntervalRef.current = setInterval(async () => {
        if (newRecording) {
          const status = await newRecording.getStatusAsync();
          if (status.metering !== undefined) {
            let calculatedDb = Math.round(status.metering + 100);
            if (calculatedDb < 30) calculatedDb = 30; // Floor baseline noise
            setDecibels(calculatedDb);
          }
        }
      }, 50);
    } catch (err) {
      console.error("Failed to start sound recording telemetry:", err);
    }
  };

  const stopMonitoring = async () => {
    setIsMonitoring(false);
    if (meterIntervalRef.current) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }
    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch (error) {
        // Safe bypass if recording structures terminated early
      }
      setRecording(null);
    }
    setDecibels(0);
  };

  const getNoiseLabel = (db: number) => {
    if (db <= 45) return { text: "Quiet Environment", color: "#4CAF50" };
    if (db <= 70) return { text: "Moderate Noise", color: "#FF9800" };
    return { text: "High Pollution Danger", color: "#F44336" };
  };

  const noiseLabel = getNoiseLabel(decibels);

  /**
   * Improved Core Upload Logic
   * Dynamically tracks GPS location to pair with structural noise payloads
   */
  async function handleLocationUpload() {
    setErrorText(false);
    setSuccessText(false);

    // 1. Text input Validation Check
    if (!noiseType.trim()) {
      setErrorText(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Request core location permission coordinates
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "GPS permissions are required to pin this sound event onto the map.",
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Grab current high precision global coordinates
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      };

      // 4. Submit fully constructed structured payload down to your DB handler
      await uploadSoundLocation(user, coords, noiseType, decibels);

      setSuccessText(true);
      setNoiseType(""); // Clear input form field on success
    } catch (error) {
      console.error("Error processing hardware or cloud upload:", error);
      setErrorText(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to start the simulation.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View testID="menu" style={styles.container}>
        <Text style={styles.title}>Sound Pollution Test</Text>

        {/* Data Fields Collection Context */}
        <View style={[styles.colContainer, { width: "100%", marginTop: 20 }]}>
          <Text style={styles.header}>Describe Noise Source</Text>
          <TextInput
            style={styles.sUser}
            placeholder="e.g., Traffic, Construction, Train, Cafe"
            value={noiseType}
            onChangeText={setNoiseType}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text style={styles.buttonText}>
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Text>
        </TouchableOpacity>

        {/* Informational Decibel Gauge Panel */}
        <View
          style={[
            styles.rowContainer,
            {
              borderColor: isMonitoring ? noiseLabel.color : "#ccc",
              borderWidth: 2,
              padding: 20,
              borderRadius: 10,
              marginVertical: 15,
              alignItems: "center",
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: 24, fontWeight: "bold" }]}>
            {isMonitoring ? `${decibels} dB` : "--"}
          </Text>
          {isMonitoring && (
            <Text
              style={[
                styles.text,
                { color: noiseLabel.color, fontWeight: "600" },
              ]}
            >
              {noiseLabel.text}
            </Text>
          )}
        </View>

        <View style={[styles.colContainer, { width: "100%", marginTop: 10 }]}>
          <TouchableOpacity
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
            onPress={handleLocationUpload}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting
                ? "Uploading Core Metrics..."
                : "Tag Current Location"}
            </Text>
          </TouchableOpacity>

          {errorText && (
            <Text style={{ color: "red", marginTop: 10, textAlign: "center" }}>
              Upload failed. Please ensure description isn't blank.
            </Text>
          )}
          {successText && (
            <Text
              style={{ color: "green", marginTop: 10, textAlign: "center" }}
            >
              Sound metrics and GPS coordinates mapped successfully!
            </Text>
          )}
        </View>

        {/* Map Route Nav link redirection */}
        <TouchableOpacity
          style={[styles.button, { marginTop: 30, backgroundColor: "#4A90E2" }]}
          onPress={async () => {
            await stopMonitoring(); // Kill tracking lines safely before switching screens
            router.push("/SoundPollution/sound_map");
          }}
        >
          <Text style={styles.buttonText}>Open Live Sound Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
