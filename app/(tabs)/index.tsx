import { router } from "expo-router";
import { useState } from "react";

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { addDoc, collection } from "firebase/firestore";

import { auth, db } from "./firebase";

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
      await addDoc(collection(db, "Debug"), {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pword,
      );

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pword,
      );

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
      await signOut(auth);

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

      await deleteUser(auth.currentUser);

      await debug("DeleteEmailPassword", "success: " + email);

      setloginout("user deleted");
    } catch (error: any) {
      setloginout("delete unsuccessful");

      await debug("DeleteEmailPassword", error.code + " " + error.message);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.header}>
        <View style={styles.colContainer}>
          <View style={styles.rowContainer}>
            <Text>{loginout}</Text>
            <Text>{created}</Text>
          </View>

          <View style={styles.colContainer}>
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
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  colContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },

  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    width: 220,
  },

  sUser: {
    width: 220,
    borderWidth: 1,
    borderColor: "#999",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
