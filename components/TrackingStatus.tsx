import { Pressable, Text, View } from "react-native";

export function TrackingStatus({
  isTracking = true,
  configName = "Config Name",
  lat = "0.0000",
  lon = "0.0000",
  thres = "500",
  dist = "1.5",
}) {
  return (
    <View className="border bg-white rounded-xl p-4 gap-3 items-center">
      <Text className="text-lg mb-3 font-bold">Tracking Status</Text>

      {isTracking ? (
        <>
          <View>
            <Text className="text-base font-semibold">{configName}</Text>
          </View>

          <View className="flex-row justify-between gap-8">
            <View className="flex-row gap-2">
              <Text className="text-gray-900">Lat</Text>
              <Text className="font-medium">{lat}</Text>
            </View>
            <View className="flex-row gap-2">
              <Text className="text-gray-900">Lon</Text>
              <Text className="font-medium">{lon}</Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Text className="text-gray-900">Threshold</Text>
            <Text className="font-medium">{thres} m</Text>
          </View>

          <View className="flex-row gap-4">
            <Text className="text-gray-900">Distance</Text>
            <Text className="font-medium">{dist} km</Text>
          </View>

          <Pressable className="mt-2 bg-red-500 py-2 px-8 rounded-lg items-center">
            <Text className="text-white">Stop tracking</Text>
          </Pressable>
        </>
      ) : (
        <Text className="text-gray-500">Not tracking any location</Text>
      )}
    </View>
  );
}
