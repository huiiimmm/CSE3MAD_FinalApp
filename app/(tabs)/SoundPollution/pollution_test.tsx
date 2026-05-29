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
import { useState } from "react";

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

  async function uploadSoundLocationA(
    user: any,
    location: string,
    noiseType: string,
  ) {
    try {
      await uploadSoundLocation(user, location, noiseType);
      console.log("Sound location uploaded successfully");
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
      </View>
    );
  }
}
