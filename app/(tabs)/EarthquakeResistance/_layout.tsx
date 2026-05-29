import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu" }} />

      <Stack.Screen
        name="earthquake_simulator"
        options={{ title: "Earthquake Simulator" }}
      />
    </Stack>
  );
}
