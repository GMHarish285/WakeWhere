import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "main-channel";
const NOTIFICATION_ID = "tracking-notification";

export async function setupTrackingNotification() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    console.log("Notification permission not granted");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Main",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0],
      sound: "default",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const type = notification.request.content.data?.type;

      if (type === "alarm") {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      }

      return {
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: true,
      };
    },
  });
}

export async function updateTrackingNotification(dist: number) {
  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: "Tracking Active",
      body: `Distance remaining: ${Math.round(dist)} m`,
      sticky: true,
      autoDismiss: false,
      sound: false,
      data: { type: "tracking" },
    },
    trigger: null,
  });
}

export async function clearTrackingNotification() {
  await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
}

export async function triggerAlarmNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Destination Reached!",
      body: "You have arrived at your destination.",
      sound: true,
      data: { type: "alarm" },
    },
    trigger: null,
  });
}
