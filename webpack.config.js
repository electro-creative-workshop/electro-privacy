const path = require("path");

module.exports = (env, argv) => [
  {
    mode: "production",
    entry: {
      main: path.resolve(__dirname, "src/js/search.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "clorox-search.js",
    },
  },
];
