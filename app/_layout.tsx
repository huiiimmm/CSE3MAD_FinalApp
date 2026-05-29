import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* Your default home or dashboard tab */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />

      {/* Point directly to your subfolder stack layout root */}
      <Tabs.Screen
        name="ReactionTest"
        options={{ title: "Reaction Tests", headerShown: false }}
      />
    </Tabs>
  );
}
