const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAlarmModuleFile(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const pkg = config.android.package; // com.harishgm.wakewhere

      const dirPath = path.join(
        projectRoot,
        "android/app/src/main/java",
        ...pkg.split("."),
      );

      const filePath = path.join(dirPath, "AlarmModule.kt");

      const content = `package ${pkg}

import android.content.Intent
import com.facebook.react.bridge.*

class AlarmModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AlarmModule"

    @ReactMethod
    fun startAlarm(uri: String) {
        val context = reactApplicationContext
        val intent = Intent(context, AlarmService::class.java)
        intent.putExtra("uri", uri)
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun stopAlarm() {
        val context = reactApplicationContext
        val intent = Intent(context, AlarmService::class.java)
        context.stopService(intent)
    }
}
`;

      // create directory if needed
      fs.mkdirSync(dirPath, { recursive: true });

      // write only if file doesn't exist (safer)
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }

      return config;
    },
  ]);
};
