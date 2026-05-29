import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Menu" }} />

      <Stack.Screen
        name="pollution_test"
        options={{ title: "Sound Pollution Test" }}
      />
    </Stack>
  );
}
