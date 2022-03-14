const { resolve } = require("path");
const { readFile } = require("fs/promises");

const spawn = require("./spawn");

async function unwrapPackage({
  fromDir = resolve(__dirname, ".."),
  toDir = process.env.INIT_CWD,
} = {}) {
  const fromPackageJsonFile = resolve(fromDir, "./package.json");
  const toPackageJsonFile = resolve(toDir, "./package.json");
  const fromJson = await readJson(fromPackageJsonFile);
  const toJson = await readJson(toPackageJsonFile);

  moveDependencies(fromJson, toJson, "dependencies");
  moveDependencies(fromJson, toJson, "devDependencies");

  // const mainDeps = buildDependencies(fromJson.dependencies);
  // const devDeps = buildDependencies(fromJson.devDependencies);

  // await installDependencies("--save", mainDeps, toDir);
  // await installDependencies("--save-dev", devDeps, toDir);
}

async function readJson(path) {
  try {
    const raw = await readFile(path);
    return JSON.parse(raw.toString());
  } catch {
    return {};
  }
}

function moveDependencies(fromJson, toJson, key) {
  if (fromJson[key]) {
    if (!toJson[key]) toJson[key] = {};

    toJson[key] = { ...toJson[key], ...fromJson[key] };
  }
}

// function buildDependencies(dependencies) {
//   const packages = [];

//   for (const key in dependencies) {
//     packages.push(`${key}@${dependencies[key]}`);
//   }

//   return packages;
// }

// async function installDependencies(flag, dependencies, cwd) {
//   const args = ["install", flag, ...dependencies];
//   return await spawn("npm", args, { cwd, onCreate: spawn.pipe });
// }

module.exports = unwrapPackage;
