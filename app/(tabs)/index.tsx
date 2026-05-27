import { globalStyles } from "@/app/Styles/globalStyles";

import { darkTheme } from "@/app/Styles/Themes/dark";
import { lightTheme } from "@/app/Styles/Themes/light";
import { useColorScheme } from "react-native";

const scheme = useColorScheme();
const theme = scheme === "dark" ? darkTheme : lightTheme;
const styles = globalStyles(theme);

import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
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

      const coords = await getLocation();
      uploadLocation(user, coords);

      router.push("/menu");
    } catch (error: any) {
      setloginout("login unsuccessful");

      await debug("SignInEmailPassword", error.code + " " + error.message);
    }
  }

  async function createA() {
    try {
      const userCredential = await createAccount(email, pword);

      const user = userCredential.user;

      await debug("createEmailPassword", "success: " + user.email);

      setloginout("created + login: " + user.email);

      setCreate("created");
    } catch (error: any) {
      setloginout("create unsuccessful");

      await debug("createEmailPassword", error.code + " " + error.message);
    }
  }

  async function logoutA() {
    try {
      if (!auth.currentUser) {
        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");
        return;
      }
      await logout();

      await debug("signoutEmailPassword", "success: " + email);

      setloginout("signed out");
    } catch (error: any) {
      setloginout("signout unsuccessful");

      await debug("SignOutEmailPassword", error.code + " " + error.message);
    }
  }

  async function deleteA() {
    try {
      if (!auth.currentUser) {
        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");

        return;
      }

      await removeUser(auth.currentUser);

      await debug("DeleteEmailPassword", "success: " + email);

      setloginout("user deleted");
    } catch (error: any) {
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
        <SafeAreaView style={styles.header}>
          <View style={styles.colContainer}>
            <View style={styles.rowContainer}>
              <Text testID="loginHeader" style={styles.text}>
                {loginout}
              </Text>
              <Text testID="createHeader" style={styles.text}>
                {created}
              </Text>
            </View>

            <View testID="index" style={styles.colContainer}>
              <TextInput
                style={styles.sUser}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
              />

              <TextInput
                style={styles.sUser}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={setPword}
                value={pword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Login" onPress={loginA} />

              <Button title="Create" onPress={createA} />

              <Button title="Logout" onPress={logoutA} />

              <Button title="Delete" onPress={deleteA} />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ScrollView>
  );
}
