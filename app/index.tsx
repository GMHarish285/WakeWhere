import { SavedConfig } from "@/components/SavedConfig";
import { TrackingStatus } from "@/components/TrackingStatus";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, ScrollView } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-gray-100 p-4 gap-5">
      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ gap: 20 }}
        showsVerticalScrollIndicator={false}
      >

        <TrackingStatus />

        <SavedConfig />
      </ScrollView>
    </View>
  );
}
