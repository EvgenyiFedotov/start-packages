const { resolve } = require("path");
const { readFile, writeFile } = require("fs/promises");

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

  await writeJson(toPackageJsonFile, toJson);
  await spawn("npm", ["install"]);

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
    toJson[key] = sortDependencies({
      ...(toJson[key] || {}),
      ...fromJson[key],
    });
  }

  return toJson[key];
}

function sortDependencies(dependencies) {
  const entries = Object.entries(dependencies).sort(([a], [b]) => {
    var textA = a.toUpperCase();
    var textB = b.toUpperCase();

    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return Object.fromEntries(entries);
}

async function writeJson(path, data) {
  try {
    await writeFile(path, JSON.stringify(data, null, 2));
  } catch {
    // pass
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
