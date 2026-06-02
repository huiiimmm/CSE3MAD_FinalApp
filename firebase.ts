// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwmIjwvDEva0VmUNnZAfhNXQITv433Wk0",
  authDomain: "cse3mad-finalapp.firebaseapp.com",
  projectId: "cse3mad-finalapp",
  storageBucket: "cse3mad-finalapp.firebasestorage.app",
  messagingSenderId: "454741062489",
  appId: "1:454741062489:web:179fc1e7492e6fe6371248",
  measurementId: "G-LCNGQBZEQP",
};
export { firebaseConfig };

  import { initializeApp } from "firebase/app";
  import {
    createUserWithEmailAndPassword,
    deleteUser,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    where,
  } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//wrappers
export const addDebugDoc = (data: any) => {
  return addDoc(collection(db, "Debug"), data);
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const createAccount = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const removeUser = (user: any) => deleteUser(user);

export const saveReactionScore = (user: any, data: any) => {
  return addDoc(collection(db, "reactionScores"), data);
};

export const getReactionLeaderboardDocs = async (
  testType: string,
  setFunction: React.Dispatch<React.SetStateAction<any[]>>,
  ascending: boolean = false,
) => {
  const q = query(
    collection(db, "reactionScores"),
    where("testType", "==", testType),
    orderBy("reactionScore", ascending ? "asc" : "desc"),
    limit(10),
  );
  const querySnapshot = await getDocs(q);
  const results: any[] = [];

  querySnapshot.forEach((doc) => {
    results.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  setFunction(results);
};

export const uploadLocation = (user: any, location: any) => {
  console.log("UPLOAD INPUT:", user, location);

  const latitude = location?.latitude ?? location?.coords?.latitude;

  const longitude = location?.longitude ?? location?.coords?.longitude;

  if (
    !user?.uid ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    console.log("Invalid location payload:", location);
    return;
  }

  return addDoc(collection(db, "locations"), {
    uid: user.uid,
    email: user.email,
    latitude,
    longitude,
    updatedAt: new Date(),
  });
};

export const uploadSoundLocation = (
  user: any,
  location: any,
  noiseType: string,
  noiseLevel: number,
) => {
  console.log("UPLOAD INPUT:", user, location, noiseType, noiseLevel);

  const latitude = location?.latitude ?? location?.coords?.latitude;
  const longitude = location?.longitude ?? location?.coords?.longitude;

  if (
    !user?.uid ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    typeof noiseType !== "string" ||
    typeof noiseLevel !== "number"
  ) {
    console.log(
      "Invalid sound pollution payload:",
      location,
      noiseType,
      noiseLevel,
    );
    return;
  }

  return addDoc(collection(db, "sound locations"), {
    uid: user.uid,
    email: user.email,
    latitude,
    longitude,
    noiseType,
    noiseLevel,
    updatedAt: new Date(),
  });
};

export const getSoundLocation = async (): Promise<LocationData[]> => {
  const querySnapshot = await getDocs(collection(db, "sound locations"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LocationData[];
};

export type LocationData = {
  id: string;
  uid: string;
  email: string;
  latitude: number;
  longitude: number;
  noiseType?: string; // Optional property for type of noise
  noiseLevel?: number; // Optional property for sound level
};

export const getAllLocations = async (): Promise<LocationData[]> => {
  const querySnapshot = await getDocs(collection(db, "locations"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LocationData[];
};

export type TestType = "test1" | "test2" | "test3" | "test4";
export const getUserBestScores = async (uid: string) => {
  try {
    // 1. Target ONLY the logged-in user's documents using a where filter query
    const q = query(
      collection(db, "reactionScores"),
      where("userId", "==", uid),
    );

    const snapshot = await getDocs(q);

    const bestScores: Record<TestType, number | null> = {
      test1: null,
      test2: null,
      test3: null,
      test4: null,
    };

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const testType = data.testType as TestType;

      // Force conversion to a number to protect against string evaluation bugs
      const reactionScore = Number(data.reactionScore);

      // Skip document processing if testType is undefined or invalid
      if (!bestScores.hasOwnProperty(testType)) continue;

      // test 3: high to low (Most clicks wins)
      if (testType === "test3") {
        const currentBest = bestScores.test3;
        if (currentBest === null || reactionScore > currentBest) {
          bestScores.test3 = reactionScore;
        }
      }
      // rest of tests: low to high (Fastest reaction speed wins)
      else if (
        testType === "test1" ||
        testType === "test2" ||
        testType === "test4"
      ) {
        const currentBest = bestScores[testType];
        if (currentBest === null || reactionScore < currentBest) {
          bestScores[testType] = reactionScore;
        }
      }
    }

    return bestScores;
  } catch (e) {
    console.error("Error getting best scores:", e);
    return {
      test1: null,
      test2: null,
      test3: null,
      test4: null,
    };
  }
};

export const uploadVibrationData = (user: any, data: any) => {
  return addDoc(collection(db, "vibration data"), {
    uid: user.uid,
    ...data,
  });
};

export const getVibrationData = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, "vibration data"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

//earthquake test score?
export const uploadEarthquakeData = (
  user: any,
  structureName: string,
  averageStructureMovementIntensity: any,
  peakStructureMovementIntensity: any,
) => {
  return addDoc(collection(db, "earthquake data"), {
    uid: user.uid,
    email: user.email,
    structureName,
    averageStructureMovementIntensity,
    peakStructureMovementIntensity,
  });
};

export const getEarthquakeData = async (): Promise<any[]> => {
  const querySnapshot = await getDocs(collection(db, "earthquake data"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
