const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  output: "export",
  distDir: "dist",
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "./_posts/images"),
            to: path.join(__dirname, "./public/images"),
          },
        ],
      })
    );
    return config;
  },
};
