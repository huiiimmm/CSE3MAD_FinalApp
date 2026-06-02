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
            if (calculatedDb < 30) calculatedDb = 30;
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
        // Safe bypass if components unmount abruptly
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

  async function handleLocationUpload() {
    setErrorText(false);
    setSuccessText(false);

    if (!noiseType.trim()) {
      setErrorText(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(
          "GPS permissions are required to pin this sound event onto the map.",
        );
        setIsSubmitting(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      };

      await uploadSoundLocation(user, coords, noiseType, decibels);

      setSuccessText(true);
      setNoiseType("");
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

        {/* Form Inputs Container */}
        <View style={styles.colContainer}>
          <Text style={styles.header}>Describe Noise Source</Text>
          <TextInput
            style={styles.sUser}
            placeholder="e.g., Traffic, Construction, Train, Cafe"
            placeholderTextColor="gray"
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

        {/* Real-time Decibel Gauge Panel mapped to rowContainer */}
        <View
          style={[
            styles.rowContainer,
            {
              borderColor: isMonitoring
                ? noiseLabel.color
                : theme.border || "#ccc",
              borderWidth: 2,
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

        {/* Submission Dashboard Status Section */}
        <View style={styles.colContainer}>
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
            <Text
              style={[
                styles.text,
                { color: "#F44336", marginTop: 10, fontSize: 14 },
              ]}
            >
              Upload failed. Please ensure description isn't blank.
            </Text>
          )}
          {successText && (
            <Text
              style={[
                styles.text,
                { color: "#4CAF50", marginTop: 10, fontSize: 14 },
              ]}
            >
              Sound metrics and GPS coordinates mapped successfully!
            </Text>
          )}
        </View>

        {/* Live Cluster Map Navigation Shortcut */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4A90E2", width: "100%" }]}
          onPress={async () => {
            await stopMonitoring();
            router.push("/SoundPollution/sound_map");
          }}
        >
          <Text style={styles.buttonText}>Open Live Sound Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
