import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { DestinationInputs } from "../components/DestinationInputs";
import { SavedDestinationList } from "../components/SavedDestinationList";
import { SaveNameModal } from "../components/SaveNameModal";

import { loadSavedItems, saveSavedItems } from "../storage/savedDestination";
import { ActiveTrip } from "../types/ActiveTrip";
import { SavedItem } from "../types/SavedItem";

import {
  isValidLatitude,
  isValidLongitude,
  isValidThreshold,
} from "../utils/inputValidation";

import { startTrip, stopTrip } from "../services/tripService";
import { loadActiveTrip } from "../storage/activeTrip";
import { getDistanceMeters } from "../utils/distance";

export default function MainScreen() {
  const router = useRouter();

  // ----------------------
  // Destination inputs
  // ----------------------
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [threshold, setThreshold] = useState("");

  // ----------------------
  // Saved destinations
  // ----------------------
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);

  // ----------------------
  // Tracking state
  // ----------------------
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);

  // ----------------------
  // Load saved destinations
  // ----------------------
  useEffect(() => {
    loadSavedItems().then(setSavedItems);
  }, []);

  useEffect(() => {
    async function restoreActiveTrip() {
      const trip = await loadActiveTrip();

      if (!trip) return;

      setLatitude(trip.latitude.toString());
      setLongitude(trip.longitude.toString());
      setThreshold(trip.threshold.toString());
      setIsTracking(true);
    }

    restoreActiveTrip();
  }, []);

  // ----------------------
  // Validation
  // ----------------------
  const latitudeValid = isValidLatitude(latitude);
  const longitudeValid = isValidLongitude(longitude);
  const thresholdValid = isValidThreshold(threshold);

  const formValid = latitudeValid && longitudeValid && thresholdValid;

  // ----------------------
  // Distance (derived state)
  // ----------------------
  const distanceToDestination =
    currentLocation && latitude && longitude
      ? getDistanceMeters(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          Number(latitude),
          Number(longitude)
        )
      : null;

  // ----------------------
  // Save destination flow
  // ----------------------
  function onSavePress() {
    if (!formValid) {
      Alert.alert(
        "Invalid input",
        "Please enter valid latitude, longitude, and threshold."
      );
      return;
    }
    setName("");
    setModalVisible(true);
  }

  async function confirmSave() {
    if (!name.trim()) {
      Alert.alert("Name required");
      return;
    }

    const newItem: SavedItem = {
      id: Date.now().toString(),
      name: name.trim(),
      latitude,
      longitude,
      threshold,
    };

    const updated = [...savedItems, newItem];
    setSavedItems(updated);
    await saveSavedItems(updated);

    setModalVisible(false);
  }

  // ----------------------
  // Start trip
  // ----------------------
  async function onStartTrip() {
    if (!formValid) {
      Alert.alert("Invalid input", "Fix destination details first.");
      return;
    }

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert("Location Disabled", "Please turn on location services.");
        return;
      }

      const trip: ActiveTrip = {
        latitude: Number(latitude),
        longitude: Number(longitude),
        threshold: Number(threshold),
        startedAt: Date.now(),
      };

      await startTrip(trip);
      setIsTracking(true);
    } catch (e: any) {
      Alert.alert(
        "Location Required",
        e.message || "Please allow location access."
      );
    }
  }

  // ----------------------
  // End trip
  // ----------------------
  async function onEndTrip() {
    await stopTrip();
    setIsTracking(false);
    setCurrentLocation(null);
  }

  // ----------------------
  // Foreground location updates (UI only)
  // ----------------------
  useEffect(() => {
    if (!isTracking) return;

    let subscription: Location.LocationSubscription | null = null;

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5,
      },
      (loc) => {
        setCurrentLocation(loc);
      }
    ).then((sub) => {
      subscription = sub;
    });

    return () => {
      subscription?.remove();
    };
  }, [isTracking]);

  async function onTerminateBackgroundTask() {
    Alert.alert(
      "Stop Background Tracking",
      "This will immediately stop all location tracking.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: async () => {
            await stopTrip();
            setIsTracking(false);
            setCurrentLocation(null);
          },
        },
      ]
    );
  }

  // ----------------------
  // UI
  // ----------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Screen</Text>

      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Text style={styles.link}>Settings</Text>
      </TouchableOpacity>

      <DestinationInputs
        latitude={latitude}
        longitude={longitude}
        threshold={threshold}
        editable={!isTracking}
        latitudeValid={latitudeValid}
        longitudeValid={longitudeValid}
        thresholdValid={thresholdValid}
        setLatitude={(v) => {
          setLatitude(v);
          setActiveSavedId(null);
        }}
        setLongitude={(v) => {
          setLongitude(v);
          setActiveSavedId(null);
        }}
        setThreshold={(v) => {
          setThreshold(v);
          setActiveSavedId(null);
        }}
      />

      {/* Save destination */}
      <TouchableOpacity
        onPress={onSavePress}
        disabled={!formValid || isTracking}
      >
        <Text
          style={[
            styles.button,
            (!formValid || isTracking) && { opacity: 0.5 },
          ]}
        >
          Save Destination
        </Text>
      </TouchableOpacity>

      {/* Start / End Trip */}
      <TouchableOpacity onPress={isTracking ? onEndTrip : onStartTrip}>
        <Text style={styles.startButton}>
          {isTracking ? "End Trip" : "Start Trip"}
        </Text>
      </TouchableOpacity>

      {isTracking && (
        <TouchableOpacity onPress={onTerminateBackgroundTask}>
          <Text style={styles.terminateButton}>Stop Background Tracking</Text>
        </TouchableOpacity>
      )}

      {/* Live location + distance */}
      {currentLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Current Location</Text>
          <Text style={styles.mono}>
            Lat: {currentLocation.coords.latitude.toFixed(5)}
          </Text>
          <Text style={styles.mono}>
            Lon: {currentLocation.coords.longitude.toFixed(5)}
          </Text>

          {distanceToDestination !== null && (
            <>
              <Text style={styles.infoTitle}>Distance to Destination</Text>
              <Text style={styles.distance}>
                {Math.round(distanceToDestination)} meters
              </Text>
            </>
          )}
        </View>
      )}

      {/* Saved destinations */}
      <SavedDestinationList
        items={savedItems}
        activeSavedId={activeSavedId}
        onUse={(item) => {
          setLatitude(item.latitude);
          setLongitude(item.longitude);
          setThreshold(item.threshold);
          setActiveSavedId(item.id);
        }}
        onDelete={async (item) => {
          const filtered = savedItems.filter((i) => i.id !== item.id);
          setSavedItems(filtered);
          await saveSavedItems(filtered);
        }}
      />

      <SaveNameModal
        visible={modalVisible}
        name={name}
        setName={setName}
        onCancel={() => setModalVisible(false)}
        onSave={confirmSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "600" },
  link: { color: "blue", marginBottom: 10 },
  button: { fontWeight: "600", marginVertical: 10 },
  startButton: {
    fontWeight: "700",
    marginVertical: 10,
    color: "green",
  },
  infoBox: {
    marginTop: 12,
    alignItems: "center",
  },
  infoTitle: {
    fontWeight: "600",
    marginTop: 6,
  },
  mono: {
    fontFamily: "monospace",
    fontSize: 13,
  },
  distance: {
    fontSize: 18,
    fontWeight: "700",
    color: "green",
    marginTop: 4,
  },
  terminateButton: {
    marginTop: 8,
    fontWeight: "700",
    color: "red",
  },
});
