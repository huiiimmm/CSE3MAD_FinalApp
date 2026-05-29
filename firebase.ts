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

export const saveScore = (user: any, data: any) => {
  return addDoc(collection(db, "scores"), data);
};

export const getLeaderboardDocs = async (
  testType: string,
  setFunction: React.Dispatch<React.SetStateAction<any[]>>,
  ascending: boolean = false,
) => {
  const q = query(
    collection(db, "scores"),
    where("testType", "==", testType),
    orderBy("score", ascending ? "asc" : "desc"),
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

export type LocationData = {
  id: string;
  uid: string;
  email: string;
  latitude: number;
  longitude: number;
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
    const snapshot = await getDocs(collection(db, "scores"));

    const bestScores: Record<TestType, number | null> = {
      test1: null,
      test2: null,
      test3: null,
      test4: null,
    };

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const testType = data.testType as TestType;
      const score = data.score;

      // test 3 high to low
      if (testType === "test3") {
        if (bestScores.test3 === null || score > bestScores.test3) {
          bestScores.test3 = score;
        }
      }

      // rest of tests low to high
      else if (
        testType === "test1" ||
        testType === "test2" ||
        testType === "test4"
      ) {
        if (bestScores[testType] === null || score < bestScores[testType]) {
          bestScores[testType] = score;
        }
      }
    }
    return bestScores;
  } catch (e) {
    console.log("Error getting best scores:", e);
    return {
      test1: null,
      test2: null,
      test3: null,
      test4: null,
    };
  }
};
