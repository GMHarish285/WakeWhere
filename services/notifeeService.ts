import notifee, {
  AndroidCategory,
  AndroidImportance,
} from "@notifee/react-native";

export const TRACKING_CHANNEL_ID = "tracking-channel";
export const ALARM_CHANNEL_ID = "alarm-channel";

const TRACKING_NOTIFICATION_ID = "tracking-notification";
export const ALARM_NOTIFICATION_ID = "alarm-notification";

export const STOP_ALARM_ACTION_ID = "stop-alarm-action"

export async function setupNotifeeChannels() {
  await notifee.createChannel({
    id: TRACKING_CHANNEL_ID,
    name: "Tracking",
    importance: AndroidImportance.LOW,
  });

  await notifee.createChannel({
    id: ALARM_CHANNEL_ID,
    name: "Alarm",
    importance: AndroidImportance.HIGH,
  });
}

export async function updateTrackingNotification(dist: number) {
  await notifee.displayNotification({
    id: TRACKING_NOTIFICATION_ID,
    title: "Tracking Active",
    body: `Distance remaining: ${Math.round(dist)} m`,
    android: {
      channelId: TRACKING_CHANNEL_ID,
      ongoing: true,
      onlyAlertOnce: true,
    },
  });
}

export async function clearTrackingNotification() {
  await notifee.cancelNotification(TRACKING_NOTIFICATION_ID);
}

export async function triggerAlarm() {
  await notifee.displayNotification({
    id: ALARM_NOTIFICATION_ID,
    title: "Wake Up!",
    body: "You have reached your destination!",
    android: {
      channelId: ALARM_CHANNEL_ID,
      category: AndroidCategory.ALARM,
      importance: AndroidImportance.HIGH,
      fullScreenAction: {
        id: "default",
      },
      ongoing: true,
      autoCancel: false,
      pressAction: { id: "default" },
      actions: [{ title: "Stop Alarm", pressAction: { id: STOP_ALARM_ACTION_ID } }],
    },
  });
}
