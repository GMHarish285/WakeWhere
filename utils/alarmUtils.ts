import { AlarmState, setAlarmState } from "@/storage/alarmStateStorage";

export async function transitionAlarmStateTo(state: AlarmState) {
  console.log("Alarm state →", state);
  await setAlarmState(state);
}
