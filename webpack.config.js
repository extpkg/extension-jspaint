const CopyPlugin = require("copy-webpack-plugin");
const path = require("node:path");

module.exports = {
  mode: process.env["NODE_ENV"],
  entry: { main: "./src/main.ts", header: "./src/header.ts" },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "[name].js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public", to: "." },
        { from: "src/styles", to: "styles" },
        { from: "src/extension-jspaint-src", to: "extension-jspaint-src" },
        { from: "src/header.html", to: "header.html" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: [
          "/node_modules/",
          path.resolve(__dirname, "src/extension-jspaint-src"),
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
