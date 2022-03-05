const fsp = require("fs/promises");
const path = require("path");

(async () => {
  const cwd = process.env.INIT_CWD || process.cwd();

  // .gitignore
  const gitignoreFile = path.resolve(cwd, "./.gitignore");

  // console.log(process.env.INIT_CWD);
  // console.log(cwd);
  // console.log(gitignoreFile);

  try {
    await fsp.access(gitignoreFile);
  } catch {
    await fsp.writeFile(
      gitignoreFile,
      [".DS_Store", "node_modules", ""].join("\n")
    );
  }

  // src
  const srcDir = path.resolve(cwd, "./src");

  await fsp.mkdir(srcDir, { recursive: true });

  // src/index.ts
  const srcIndexFile = path.resolve(srcDir, "./index.ts");

  try {
    await fsp.access(srcIndexFile);
  } catch {
    await fsp.writeFile(srcIndexFile, "export {};\n");
  }
})();
