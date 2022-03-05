const path = require("path");
const NodeExternals = require("webpack-node-externals");

const cwd = process.cwd();

module.exports = () => ({
  target: "node",
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)?$/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "./babel.config.js"),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    modules: [path.resolve(cwd, "./src"), path.resolve(cwd, "./node_modules")],
  },
  externals: [NodeExternals()],
});
