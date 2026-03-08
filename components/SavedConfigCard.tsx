import { Config } from "@/storage/configStorage";
import { Pressable, Text, View } from "react-native";

type SavedConfigCardProps = {
  config: Config;
  onEdit?: () => void;
  onDelete?: () => void;
  onStart?: () => void;
};

export function SavedConfigCard({
  config,
  onStart,
  onEdit,
  onDelete,
}: SavedConfigCardProps) {
  return (
    <View className="border border-gray-200 bg-white rounded-lg p-4 gap-3">
      <Text className="text-base font-semibold">{config.name}</Text>

      <View className="flex-row justify-between">
        <View className="flex-row gap-2">
          <Text className="text-gray-600">Lat</Text>
          <Text className="font-medium">{config.lat}</Text>
        </View>

        <View className="flex-row gap-2">
          <Text className="text-gray-600">Lon</Text>
          <Text className="font-medium">{config.lon}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-gray-600">Threshold</Text>
        <Text className="font-medium">{config.thres} m</Text>
      </View>

      <View className="flex-row gap-3 mt-2">
        <Pressable className="flex-1 bg-blue-600 py-2 rounded-lg items-center">
          <Text className="text-white font-medium">Start</Text>
        </Pressable>

        <Pressable
          className="flex-1 border border-gray-400 py-2 rounded-lg items-center"
          onPress={onEdit}
        >
          <Text className="font-medium">Edit</Text>
        </Pressable>

        <Pressable
          className="flex-1 border border-red-500 py-2 rounded-lg items-center"
          onPress={onDelete}
        >
          <Text className="text-red-500 font-medium">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}
