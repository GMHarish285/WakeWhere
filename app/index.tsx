import { SavedConfigCard } from "@/components/SavedConfigCard";
import { TrackingStatus } from "@/components/TrackingStatus";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 p-4 bg-gray-200 gap-4">
      <View className="items-end">
        <Text>Settings</Text>
        <Text>+</Text>
      </View>

      <View>
        {/* <Text>Not tracking any location</Text> */}
        <TrackingStatus />
      </View>
      
      <View>
        <Text>Saved Configs</Text>
        {/* <Text>No saved configs yet</Text> */}
        <SavedConfigCard />
      </View>
    </View>
  );
}
