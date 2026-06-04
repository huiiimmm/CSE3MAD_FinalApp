import {
  addDebugDoc,
  auth,
  createAccount,
  login,
  logout,
  removeUser,
  uploadLocation,
} from "@/firebase";
import { globalStyles } from "@/Styles/globalStyles";
import { darkTheme } from "@/Styles/Themes/dark";
import { lightTheme } from "@/Styles/Themes/light";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [loginout, setloginout] = useState("Awaiting Credentials");
  const [created, setCreate] = useState("No Action Registered");
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
      console.error("Cloud logging telemetry error:", e);
    }
  }

  async function loginA() {
    try {
      const userCredential = await login(email, pword);
      const user = userCredential.user;
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await uploadLocation(user.uid, locationData);

      await debug("signinEmailPassword", "success: " + user.email);
      setloginout("Active User: " + user.email);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setloginout("Authentication failed");
      await debug("SignInEmailPassword", error.code + " " + error.message);
    }
  }

  async function createA() {
    try {
      const userCredential = await createAccount(email, pword);
      const user = userCredential.user;

      await debug("createEmailPassword", "success: " + user.email);
      setloginout("Profile generated: " + user.email);
      setCreate("Account Created");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setloginout("Registration failed");
      await debug("createEmailPassword", error.code + " " + error.message);
    }
  }

  async function logoutA() {
    try {
      if (!auth.currentUser) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await debug("DeleteEmailPassword", "No active user footprint found");
        setloginout("No user session exists");
        return;
      }
      await logout();
      await debug("signoutEmailPassword", "success: " + email);

      setloginout("Session closed successfully");
      setCreate("No Action Registered");
      setEmail("");
      setPword("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setloginout("Logout failed");
      await debug("SignOutEmailPassword", error.code + " " + error.message);
    }
  }

  async function deleteA() {
    try {
      if (!auth.currentUser) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        await debug("DeleteEmailPassword", "No active user footprint found");
        setloginout("No user session exists");
        return;
      }

      await removeUser(auth.currentUser);
      await debug("DeleteEmailPassword", "success: " + email);

      setloginout("Profile permanently deleted");
      setCreate("No Action Registered");
      setEmail("");
      setPword("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setloginout("Deletion failed");
      await debug("DeleteEmailPassword", error.code + " " + error.message);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, { paddingHorizontal: 24 }]}>
            {/* Header Identity & Telemetry Monitoring Blocks */}
            <View
              style={[
                styles.dataCard,
                {
                  width: "100%",
                  padding: 16,
                  marginBottom: 25,
                  borderLeftWidth: 4,
                  borderLeftColor: "#4A90E2",
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 12, color: "gray", fontWeight: "600" },
                ]}
              >
                SECURITY PROTOCOL STATUS
              </Text>
              <Text
                testID="loginHeader"
                style={[
                  styles.text,
                  {
                    fontSize: 15,
                    fontWeight: "700",
                    marginTop: 4,
                    color: theme.text,
                  },
                ]}
              >
                {loginout}
              </Text>
              <Text
                testID="createHeader"
                style={[
                  styles.text,
                  { fontSize: 13, color: "gray", marginTop: 2 },
                ]}
              >
                Action Stack: {created}
              </Text>
            </View>

            {/* Input Component Field Layer */}
            <View
              style={[
                styles.colContainer,
                { width: "100%", gap: 12, marginBottom: 25 },
              ]}
            >
              <TextInput
                testID="email"
                style={[
                  styles.sUser,
                  {
                    width: "100%",
                    height: 50,
                    borderWidth: 1,
                    borderColor: theme.border || "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    color: theme.text,
                    backgroundColor: theme.card || "transparent",
                  },
                ]}
                placeholder="Email Address"
                placeholderTextColor={scheme === "dark" ? "#aaa" : "#666"}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                onChangeText={setEmail}
                value={email}
              />

              <TextInput
                testID="password"
                style={[
                  styles.sUser,
                  {
                    width: "100%",
                    height: 50,
                    borderWidth: 1,
                    borderColor: theme.border || "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    color: theme.text,
                    backgroundColor: theme.card || "transparent",
                  },
                ]}
                placeholder="Account Password"
                placeholderTextColor={scheme === "dark" ? "#aaa" : "#666"}
                secureTextEntry={true}
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={setPword}
                value={pword}
              />
            </View>

            {/* Action Matrix Elements */}
            <View style={[styles.colContainer, { width: "100%", gap: 10 }]}>
              <TouchableOpacity
                testID="loginButton"
                style={[
                  styles.button,
                  { width: "100%", backgroundColor: "#4A90E2" },
                ]}
                onPress={loginA}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Secure Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="createButton"
                style={[
                  styles.button,
                  {
                    width: "100%",
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: "#4A90E2",
                  },
                ]}
                onPress={createA}
              >
                <Text style={[styles.buttonText, { color: "#4A90E2" }]}>
                  Register Account
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 10,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flex: 1,
                      backgroundColor: theme.card || "#e0e0e0",
                      height: 44,
                    },
                  ]}
                  onPress={logoutA}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { fontSize: 14, color: theme.text },
                    ]}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { flex: 1, backgroundColor: "#F44336", height: 44 },
                  ]}
                  onPress={deleteA}
                >
                  <Text
                    style={[styles.buttonText, { fontSize: 14, color: "#fff" }]}
                  >
                    Purge User
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
