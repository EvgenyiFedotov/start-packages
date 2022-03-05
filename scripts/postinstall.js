const fsp = require("fs/promises");
const path = require("path");

(async () => {
  const cwd = process.env.INIT_CWD || process.cwd();
  const configFile = path.resolve(cwd, "./webpack.config.js");

  // Add webpack.config.js
  try {
    await fsp.access(configFile);
  } catch {
    await fsp.writeFile(
      configFile,
      `module.exports = require("@start-packages/webpack-typescript-node");\n`
    );
  }

  // Add scripts to package.json
  const packageFile = path.resolve(cwd, "./package.json");

  try {
    await fsp.access(packageFile);

    const json = JSON.parse((await fsp.readFile(packageFile)).toString());

    if (!json.scripts) {
      json.scripts = {};
    }

    if (!("build" in json.scripts)) {
      json.scripts.build = "webpack";
    }

    if (!("start" in json.scripts)) {
      json.scripts.start = "webpack --watch --progress --env mode=development";
    }

    await fsp.writeFile(packageFile, JSON.stringify(json, null, 2));
  } catch {
    // pass
  }
})();
