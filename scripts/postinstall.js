const fsp = require("fs/promises");
const path = require("path");

(async () => {
  const cwd = process.env.INIT_CWD || process.cwd();
  const configFile = path.resolve(cwd, "./.eslintrc.js");

  try {
    await fsp.access(configFile);
  } catch {
    await fsp.writeFile(
      configFile,
      `module.exports = require("@start-packages/eslint-typescript");\n`
    );
  }
})();