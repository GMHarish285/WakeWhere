import { setSelectedLocation } from "@/utils/mapSelectionStore";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LeafletView } from "react-native-leaflet-view";

interface MapMessage {
  event?: string;
  payload?: {
    touchLatLng?: {
      lat: number;
      lng: number;
    };
  };
}

const DEFAULT_LOCATION = {
  latitude: 20, 
  longitude: 0,
};

export default function MapScreen() {
  const [marker, setMarker] = useState(DEFAULT_LOCATION);
  const [zoom, setZoom] = useState(2);

  const handleMessage = useCallback((message: MapMessage) => {
    if (message?.event === "onMapClicked") {
      const { lat, lng } = message.payload?.touchLatLng || {};

      if (lat !== undefined && lng !== undefined) {
        setMarker({ latitude: lat, longitude: lng });
        setZoom(16);
      }
    }
  }, []);

  function handleConfirm() {
    setSelectedLocation({
      lat: marker.latitude,
      lon: marker.longitude,
    });

    router.back();
  }

  return (
    <View style={{ flex: 1 }}>
      <LeafletView
        mapCenterPosition={marker}
        zoom={zoom}
        onMessageReceived={handleMessage}
        mapMarkers={[
          {
            id: "selected",
            position: marker,
            icon: "📍",
          },
        ]}
      />

      {/* Confirm Button */}
      <View style={{ position: "absolute", bottom: 30, left: 20, right: 20 }}>
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
