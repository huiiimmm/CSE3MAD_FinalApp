import { globalStyles } from "@/app/Styles/globalStyles";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  addDebugDoc,
  auth,
  createAccount,
  login,
  logout,
  removeUser,
} from "@/firebase";
let n = 0;

export default function HomeScreen() {
  const [loginout, setloginout] = useState("Login");
  const [created, setCreate] = useState("Create");
  const [pword, setPword] = useState("");
  const [email, setEmail] = useState("");

  async function debug(tag: string, str: string) {
    const id = n++;

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
      loginA();
    } catch (error: any) {
      setloginout("create unsuccessful");

      await debug("createEmailPassword", error.code + " " + error.message);
      router.push("/menu"); // temp bypass for crawler
    }
  }

  async function logoutA() {
    try {
      if (!auth.currentUser) {
        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");
        router.push("/menu"); // temp bypass for crawler
        return;
      }
      await logout();

      await debug("signoutEmailPassword", "success: " + email);
      router.push("/menu"); // temp bypass for crawler

      setloginout("signed out");
    } catch (error: any) {
      setloginout("signout unsuccessful");

      await debug("SignOutEmailPassword", error.code + " " + error.message);
      router.push("/menu"); // temp bypass for crawler
    }
  }

  async function deleteA() {
    try {
      if (!auth.currentUser) {
        await debug("DeleteEmailPassword", "No current user");

        setloginout("no user logged in");
        router.push("/menu"); // temp bypass for crawler

        return;
      }

      await removeUser(auth.currentUser);

      await debug("DeleteEmailPassword", "success: " + email);

      setloginout("user deleted");
      router.push("/menu"); // temp bypass for crawler
    } catch (error: any) {
      setloginout("delete unsuccessful");

      await debug("DeleteEmailPassword", error.code + " " + error.message);
      router.push("/menu"); // temp bypass for crawler
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={globalStyles.header}>
        <View style={globalStyles.colContainer}>
          <View style={globalStyles.rowContainer}>
            <Text style={globalStyles.text}>{loginout}</Text>
            <Text style={globalStyles.text}>{created}</Text>
          </View>

          <View testID="index" style={globalStyles.colContainer}>
            <TextInput
              style={globalStyles.sUser}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />

            <TextInput
              style={globalStyles.sUser}
              placeholder="Password"
              onChangeText={setPword}
              value={pword}
            />
          </View>

          <View style={globalStyles.buttonContainer}>
            <Button title="Login" onPress={loginA} />

            <Button title="Create" onPress={createA} />

            <Button title="Logout" onPress={logoutA} />

            <Button title="Delete" onPress={deleteA} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
