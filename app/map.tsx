import { setSelectedLocation } from "@/utils/mapSelectionStore";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LeafletView } from "react-native-leaflet-view";

type MapLocation = {
  lat: number;
  lng: number;
};

export default function MapScreen() {
  const [html, setHtml] = useState<string | null>(null);
  const [location, setLocation] = useState<MapLocation | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadHtml = async () => {
      try {
        const asset = Asset.fromModule(require("../assets/leaflet.html"));
        await asset.downloadAsync();

        const content = await FileSystem.readAsStringAsync(asset.localUri!);

        if (mounted) {
          setHtml(content);
        }
      } catch (e) {
        console.error("HTML load error:", e);
      }
    };

    loadHtml();

    return () => {
      mounted = false;
    };
  }, []);

  function handleMessage(msg: any) {
    try {
      const data = typeof msg === "string" ? JSON.parse(msg) : msg;

      // react-native-leaflet-view default event
      if (data?.event === "onMapClicked") {
        const { lat, lng } = data.payload.touchLatLng;

        setLocation({ lat, lng });
      }
    } catch (e) {
      console.warn("Map message error:", e);
    }
  }

  function handleConfirm() {
    if (!location) return;

    setSelectedLocation({
      lat: location.lat,
      lon: location.lng,
    });

    router.back();
  }

  if (!html) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <LeafletView
        source={{ html }}
        mapCenterPosition={
          location
            ? { lat: location.lat, lng: location.lng }
            : { lat: 20, lng: 79 }
        }
        zoom={location ? 16 : 2}
        onMessageReceived={handleMessage}
        mapMarkers={
          location
            ? [
                {
                  id: "selected",
                  position: {
                    lat: location.lat,
                    lng: location.lng,
                  },
                  icon: "https://cdn-icons-png.flaticon.com/64/2776/2776067.png",
                  size: [32, 32],
                  iconAnchor: [16, 32],
                },
              ]
            : []
        }
      />

      {/* Confirm button */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
        }}
      >
        <Pressable
          onPress={handleConfirm}
          style={{
            backgroundColor: "#2563eb",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Confirm Location
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
