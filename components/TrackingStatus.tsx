import { stopLocationTracking } from "@/services/locationService";
import { Config } from "@/storage/configStorage";
import { Pressable, Text, View } from "react-native";

type TrackingStatusProps = {
  config?: Config | null;
  dist?: number | null;
  onStop?: () => void;
};

export function TrackingStatus({ config, dist, onStop }: TrackingStatusProps) {
  return (
    <View className="border border-gray-200 bg-white rounded-xl p-4 gap-5">
      <Text className="text-lg font-bold">Tracking Status</Text>

      {config ? (
        <>
          <Text className="text-base font-semibold">{config.name}</Text>

          <View className="px-10 gap-3">
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

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Distance</Text>
              <Text className="font-medium">{dist ? `${Math.round(dist)} m` : "Calculating..."}</Text>
            </View>
          </View>

          <Pressable className="mt-2 bg-red-500 py-3 rounded-lg items-center">
            <Text
              className="text-white font-medium"
              onPress={onStop}
            >
              Stop tracking
            </Text>
          </Pressable>
        </>
      ) : (
        <Text className="text-gray-500">Not tracking any location</Text>
      )}
    </View>
  );
}
