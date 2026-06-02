import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* Your default home or dashboard tab */}
      <Tabs.Screen name="(tabs)/index" options={{ title: "Login" }} />

      {/* Point directly to your subfolder stack layout root */}
      <Tabs.Screen
        name="(tabs)/ReactionTest"
        options={{ title: "Reaction Tests" }}
      />

      <Tabs.Screen
        name="(tabs)/EarthquakeResistance"
        options={{
          title: "Earthquake Resistance",
        }}
      />
      <Tabs.Screen
        name="(tabs)/SoundPollution"
        options={{
          title: "Sound Pollution",
        }}
      />
      <Tabs.Screen
        name="(tabs)/StretchTest"
        options={{
          title: "Stretch Test",
        }}
      />
    </Tabs>
  );
}
