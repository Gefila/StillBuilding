const { withDangerousMod, AndroidConfig } = require("expo/config-plugins");
const fs = require("fs/promises");
const path = require("path");

const withAndroidDisplayCutout = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const resDir = await AndroidConfig.Paths.getResourceFolderAsync(
        config.modRequest.projectRoot,
      );
      const valuesPath = path.join(resDir, "values");
      const stylesFilePath = path.resolve(valuesPath, "styles.xml");

      try {
        let stylesContent = await fs.readFile(stylesFilePath, "utf8");

        if (
          !stylesContent.includes("android:windowLayoutInDisplayCutoutMode")
        ) {
          const replacement =
            '    <item name="android:windowLayoutInDisplayCutoutMode" tools:targetApi="p">shortEdges</item>\n  </style>';
          stylesContent = stylesContent.replace("</style>", replacement);
          await fs.writeFile(stylesFilePath, stylesContent);
        }
      } catch (err) {
        console.warn("Failed to apply withAndroidDisplayCutout plugin:", err);
      }

      return config;
    },
  ]);
};

module.exports = withAndroidDisplayCutout;
