// measure noise from different actions
// record sound levels and location
// map loud and quiet zones

//user input location name, noise type, and noise level
// map data upload from reaction test
// sound recording

//   async function getLocation() {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       console.log("Permission denied");
//       return;
//     }
//     const location = await Location.getCurrentPositionAsync({});
//     const { latitude, longitude } = location.coords;
//     return { latitude, longitude };
//   }
// const coords = await getLocation();
//       uploadLocation(user, coords);
import { globalStyles } from "@/Styles/globalStyles";

import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";

import { auth, uploadSoundLocation } from "@/firebase";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

import { router } from "expo-router";
import {
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

  const [userLocation, setUserLocation] = useState("");
  const [noiseType, setNoiseType] = useState("");
  const [errorText, setErrorText] = useState(false);
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
      // 1. Request microphone usage confirmation from the user
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert(
          "Microphone permission is required to calculate noise pollution.",
        );
        return;
      }

      // 2. Set the global audio configuration mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // 3. Create a fresh recording stream instance with metering enabled
      const { recording: newRecording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.LOW_QUALITY, // Low quality is perfect for basic metering
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

      // 4. Start polling the meter at 50ms intervals for responsive UI tracking
      meterIntervalRef.current = setInterval(async () => {
        if (newRecording) {
          const status = await newRecording.getStatusAsync();

          // Metering values range from -160 (complete silence) to 0 (maximum volume)
          if (status.metering !== undefined) {
            const rawMetering = status.metering;

            // Convert raw dBFS metering values to a user-friendly positive 0-120 dB approximation scale
            // -160dB is absolute digital floor silence, so we offset and scale it safely
            let calculatedDb = Math.round(rawMetering + 100);
            if (calculatedDb < 30) calculatedDb = 30; // Ambient room floor baseline buffer

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
        // Safe bypass if recording instances have already terminated
      }
      setRecording(null);
    }
    setDecibels(0);
  };

  // Get a readable label categorizing the environmental noise threat matrix
  // db is decibels not database
  const getNoiseLabel = (db: number) => {
    if (db <= 45) return { text: "Quiet Environment", color: "#4CAF50" };
    if (db <= 70) return { text: "Moderate Noise", color: "#FF9800" };
    return { text: "High Pollution Danger", color: "#F44336" };
  };

  const noiseLabel = getNoiseLabel(decibels);

  async function uploadSoundLocationA(
    user: any,
    location: string,
    noiseType: string,
  ) {
    try {
      await uploadSoundLocation(user, location, noiseType, decibels);
      console.log("Sound location uploaded successfully");
      router.push("/SoundPollution/record_sound");
    } catch (error) {
      console.error("Error uploading sound location:", error);
      setErrorText(true);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to start the simulation.</Text>
      </View>
    );
  } else {
    return (
      <View testID="menu" style={styles.container}>
        <Text style={styles.title}>Sound Pollution Test</Text>

        <View style={styles.colContainer}>
          <Text style={styles.header}>Enter Location</Text>
          <TextInput
            style={styles.sUser}
            placeholder="Location Name"
            onChangeText={setUserLocation}
          />
        </View>

        <View style={styles.colContainer}>
          <Text style={styles.header}>Select Noise Type</Text>
          <TextInput
            style={styles.sUser}
            placeholder="Noise Type"
            onChangeText={setNoiseType}
          />
        </View>

        <View style={styles.colContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => uploadSoundLocationA(user, userLocation, noiseType)}
          >
            <Text style={styles.header}>Input Location</Text>
            {errorText && (
              <Text style={{ color: "red", marginTop: 10 }}>
                Please fill in all fields.
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.rowContainer,
            { borderColor: isMonitoring ? noiseLabel.color : "#ccc" },
          ]}
        >
          <Text style={styles.text}>
            {isMonitoring ? `${decibels} dB` : "--"}
          </Text>
          {isMonitoring && (
            <Text style={[styles.text, { color: noiseLabel.color }]}>
              {noiseLabel.text}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isMonitoring ? styles.button : styles.button]}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text style={styles.buttonText}>
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
