import { SavedConfig } from "@/components/SavedConfig";
import { TrackingStatus } from "@/components/TrackingStatus";
import { ScrollView, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-gray-100 px-4 py-2 gap-5">
      <ScrollView
        className="flex-1 p-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      >
        <TrackingStatus />

        <SavedConfig />
      </ScrollView>
    </View>
  );
}
