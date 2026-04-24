const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAlarmMainAplication(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const pkg = config.android.package; // com.harishgm.wakewhere

      const filePath = path.join(
        projectRoot,
        "android/app/src/main/java",
        ...pkg.split("."),
        "MainApplication.kt",
      );

      let contents = fs.readFileSync(filePath, "utf-8");

      // -----------------------------
      // ✅ Add import if missing
      // -----------------------------
      const importLine = `import ${pkg}.AlarmPackage`;

      if (!contents.includes(importLine)) {
        contents = contents.replace(
          "import expo.modules.ReactNativeHostWrapper",
          `${importLine}\nimport expo.modules.ReactNativeHostWrapper`,
        );
      }

      // -----------------------------
      // ✅ Add AlarmPackage() to packages
      // -----------------------------
      if (!contents.includes("add(AlarmPackage())")) {
        contents = contents.replace(
          "PackageList(this).packages.apply {",
          `PackageList(this).packages.apply {
              add(AlarmPackage())`,
        );
      }

      fs.writeFileSync(filePath, contents);

      return config;
    },
  ]);
};
