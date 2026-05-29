import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Index" }} />

      <Stack.Screen name="menu" options={{ title: "Menu" }} />

      <Stack.Screen name="info" options={{ title: "Info" }} />

      <Stack.Screen name="test1" options={{ title: "Test1" }} />

      <Stack.Screen name="test2" options={{ title: "Test2" }} />

      <Stack.Screen name="test3" options={{ title: "Test3" }} />

      <Stack.Screen name="test4" options={{ title: "Test4" }} />

      <Stack.Screen name="results" options={{ title: "Results" }} />

      <Stack.Screen name="directory" options={{ title: "Directory" }} />

      <Stack.Screen name="map" options={{ title: "Map" }} />

      <Stack.Screen name="myresults" options={{ title: "My Results" }} />
    </Stack>
  );
}
