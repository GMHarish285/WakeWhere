import { Pressable, Text, View } from "react-native";

export function SavedConfigCard({
  savedConfigName = "Saved Config Name",
  lat = "0.0000",
  lon = "0.0000",
  thres = "500",
}) {
  return (
    <View className="border border-gray-200 bg-white rounded-lg p-4 gap-3 w-full">
      <Text className="text-base font-semibold">{savedConfigName}</Text>

      <View className="flex-row justify-between">
        <View className="flex-row gap-2">
          <Text className="text-gray-600">Lat</Text>
          <Text className="font-medium">{lat}</Text>
        </View>

        <View className="flex-row gap-2">
          <Text className="text-gray-600">Lon</Text>
          <Text className="font-medium">{lon}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-600">Threshold</Text>
        <Text className="font-medium">{thres} m</Text>
      </View>

      <View className="flex-row gap-3 mt-2">
        <Pressable className="flex-1 bg-blue-500 py-2 rounded-lg items-center">
          <Text className="text-white font-medium">Start Tracking</Text>
        </Pressable>

        <Pressable className="flex-1 border border-red-500 py-2 rounded-lg items-center">
          <Text className="text-red-500 font-medium">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
