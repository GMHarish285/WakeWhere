import { transitionAlarmStateTo } from "@/utils/alarmUtils";
import notifee, { EventType } from "@notifee/react-native";
import { ALARM_NOTIFICATION_ID, STOP_ALARM_ACTION_ID } from "./notifeeService";
import { stopNativeAlarm } from "@/utils/nativeAlarm";

export function registerNotifeeEvents() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      if (detail.pressAction?.id === STOP_ALARM_ACTION_ID) {
        await stopAlarm();
      }
    }
  });

  notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      if (detail.pressAction?.id === STOP_ALARM_ACTION_ID) {
        await stopAlarm();
      }
    }
  });
}

export async function stopAlarm() {
  await notifee.cancelNotification(ALARM_NOTIFICATION_ID);
  stopNativeAlarm();
  await transitionAlarmStateTo("stopped");
}
