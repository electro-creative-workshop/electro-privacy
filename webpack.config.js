const path = require("path");

module.exports = (env, argv) => [
  {
    mode: "production",
    entry: {
      main: ["./src/js/ot-dns-script-1.js", "./src/js/ot-dns-script-2.js"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "electro-dns-privacy.js",
    },
  },
];
