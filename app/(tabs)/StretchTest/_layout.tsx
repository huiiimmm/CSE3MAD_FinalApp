import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu" }} />

      <Stack.Screen name="stretch_test" options={{ title: "Stretch Test" }} />

      <Stack.Screen
        name="stretch_results"
        options={{ title: "Stretch Test Results" }}
      />
    </Stack>
  );
}
