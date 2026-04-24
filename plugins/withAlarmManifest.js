const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withAlarmManifest(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;

    // -----------------------------
    // ✅ Add WAKE_LOCK permission
    // -----------------------------
    const permissions = manifest.manifest["uses-permission"] || [];

    const hasWakeLock = permissions.some(
      (p) => p.$["android:name"] === "android.permission.WAKE_LOCK",
    );

    if (!hasWakeLock) {
      permissions.push({
        $: { "android:name": "android.permission.WAKE_LOCK" },
      });
    }

    manifest.manifest["uses-permission"] = permissions;

    // -----------------------------
    // ✅ Add AlarmService
    // -----------------------------
    const application = manifest.manifest.application[0];

    application.service = application.service || [];

    const hasService = application.service.some(
      (s) => s.$["android:name"] === ".AlarmService",
    );

    if (!hasService) {
      application.service.push({
        $: {
          "android:name": ".AlarmService",
          "android:foregroundServiceType": "mediaPlayback",
          "android:exported": "false",
        },
      });
    }

    return config;
  });
};
