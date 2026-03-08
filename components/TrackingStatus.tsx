import { Config } from "@/storage/configStorage";
import { Pressable, Text, View } from "react-native";

type TrackingStatusProps = {
  config?: Config | null;
  dist?: number | null;
  lat?: number | null;
  lon?: number | null;
  onStop?: () => void;
};

export function TrackingStatus({
  config,
  dist,
  lat,
  lon,
  onStop,
}: TrackingStatusProps) {
  return (
    <View className="border border-gray-200 bg-white rounded-xl p-4 gap-5">
      <Text className="text-lg font-bold">Tracking Status</Text>

      {config ? (
        <>
          <Text className="text-base font-semibold">{config.name}</Text>

          <View className="px-5 gap-3">
            {/* Destination */}
            <View className="flex-row justify-between">
              <View className="flex-row gap-2">
                <Text className="text-gray-600">Dest Lat</Text>
                <Text className="font-medium">{config.lat}</Text>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-gray-600">Dest Lon</Text>
                <Text className="font-medium">{config.lon}</Text>
              </View>
            </View>

            {/* Current Position */}
            <View className="flex-row justify-between">
              <View className="flex-row gap-2">
                <Text className="text-gray-600">Curr Lat</Text>
                <Text className="font-medium">
                  {lat ? lat.toFixed(6) : "Loading..."}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <Text className="text-gray-600">Curr Lon</Text>
                <Text className="font-medium">
                  {lon ? lon.toFixed(6) : "Loading..."}
                </Text>
              </View>
            </View>

            {/* Threshold */}
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Threshold</Text>
              <Text className="font-medium">{config.thres} m</Text>
            </View>

            {/* Distance */}
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Distance</Text>
              <Text className="font-medium">
                {dist ? `${Math.round(dist)} m` : "Calculating..."}
              </Text>
            </View>
          </View>

          <Pressable
            className="mt-2 bg-red-500 py-3 rounded-lg items-center"
            onPress={onStop}
          >
            <Text className="text-white font-medium">Stop tracking</Text>
          </Pressable>
        </>
      ) : (
        <Text className="text-gray-500">Not tracking any location</Text>
      )}
    </View>
  );
}
