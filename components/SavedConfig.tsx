import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { CreateConfig } from "./CreateConfig";
import { SavedConfigCard } from "./SavedConfigCard";

export function SavedConfig() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <View className="border border-gray-200 bg-white rounded-xl p-4 gap-4">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-bold">Saved Configs</Text>

        <Pressable
          className="bg-blue-500 p-2 rounded-lg"
          onPress={() => setShowPopup(true)}
        >
          <Ionicons name="add" size={20} color="white" />
        </Pressable>
      </View>

      <SavedConfigCard />
      <SavedConfigCard />
      <SavedConfigCard />

      <CreateConfig visible={showPopup} onClose={() => setShowPopup(false)} />
    </View>
  );
}
