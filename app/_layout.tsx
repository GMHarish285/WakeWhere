import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen
          name="index"
          options={{
            title: "WakeWhere",
            headerRight: () => (
              <Pressable
                onPress={() => router.push("/settings")}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="settings-outline" size={22} color="black" />
              </Pressable>
            ),
          }}
        />

        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />

      <Stack.Screen
        name="map"
        options={{
          title: "Select Location",
        }}
      />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
