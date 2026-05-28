import { globalStyles } from "@/app/Styles/globalStyles";
import * as Haptics from "expo-haptics";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity, useColorScheme, View
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  addDebugDoc,
  auth,
  createAccount,
  login,
  logout,
  removeUser,
  uploadLocation,
} from "@/firebase";

import * as Location from "expo-location";

export default function HomeScreen() {
  const [loginout, setloginout] = useState("Login");
  const [created, setCreate] = useState("Create");
  const [pword, setPword] = useState("");
  const [email, setEmail] = useState("");
  const debugCounter = useRef(0);
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const styles = globalStyles(theme);

  async function debug(tag: string, str: string) {
    const id = ++debugCounter.current;

    console.log(`${tag} No. ${id}`, str);

    try {
      await addDebugDoc({
        Tag: `${tag} No. ${id}`,
        Str: str,
        Timestamp: new Date(),
      });
    } catch (e) {
      console.error("Error adding document:", e);
    }
  }

  async function loginA() {
    try {
      const userCredential = await login(email, pword);

      const user = userCredential.user;

      await debug("signinEmailPassword", "success: " + user.email);

      setloginout("login: " + user.email);
      router.push("/menu");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const coords = await getLocation();
      uploadLocation(user, coords);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setloginout("login unsuccessful");

      await debug("SignInEmailPassword", error.code + " " + error.message);
    }
  }

  async function createA() {
    try {
      //crawl bypass
      router.push("/menu");

      const userCredential = await createAccount(email, pword);

      const user = userCredential.user;

      await debug("createEmailPassword", "success: " + user.email);

      setloginout("created + login: " + user.email);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setCreate("created");
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setloginout("create unsuccessful");

      await debug("createEmailPassword", error.code + " " + error.message);
    }
  }

  async function logoutA() {
    try {
      if (!auth.currentUser) {
        //crawl bypass
        router.push("/menu");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");
        return;
      }
      //crawl bypass
      router.push("/menu");
      await logout();

      await debug("signoutEmailPassword", "success: " + email);

      setloginout("signed out");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setloginout("signout unsuccessful");

      await debug("SignOutEmailPassword", error.code + " " + error.message);
    }
  }

  async function deleteA() {
    try {
      if (!auth.currentUser) {
        //crawl bypass
        router.push("/menu");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");

        return;
      }
      //crawl bypass
      router.push("/menu");

      await removeUser(auth.currentUser);

      await debug("DeleteEmailPassword", "success: " + email);

      setloginout("user deleted");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setloginout("delete unsuccessful");

      await debug("DeleteEmailPassword", error.code + " " + error.message);
    }
  }

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    return { latitude, longitude };
  }

  return (
    <ScrollView>
      <SafeAreaProvider>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.colContainer}>
              <Text testID="loginHeader" style={styles.text}>
                {loginout}
              </Text>
              <Text testID="createHeader" style={styles.text}>
                {created}
              </Text>
            </View>

            <View style={styles.colContainer}>
              <TextInput
                testID="email"
                style={styles.sUser}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
              />

              <TextInput
                testID="password"
                style={styles.sUser}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPword}
                value={pword}
              />
            </View>

            <View style={styles.colContainer}>
              <TouchableOpacity
                testID="loginButton"
                style={styles.button}
                onPress={loginA}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="createButton"
                style={styles.button}
                onPress={createA}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={logoutA}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={deleteA}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ScrollView>
  );
}
