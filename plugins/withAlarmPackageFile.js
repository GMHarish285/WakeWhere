const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAlarmPackageFile(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const pkg = config.android.package;

      const dirPath = path.join(
        projectRoot,
        "android/app/src/main/java",
        ...pkg.split("."),
      );

      const filePath = path.join(dirPath, "AlarmPackage.kt");

      const content = `package ${pkg}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class AlarmPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(AlarmModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;

      fs.mkdirSync(dirPath, { recursive: true });

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }

      return config;
    },
  ]);
};
