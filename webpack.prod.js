const path = require("path");
const CopyPlugin = require("copy-webpack-plugin"); // copy from assets to dist folder
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // extract CSS from HTML. CSS or HTML can load without loading the other
const PurgeCss = require("purgecss-webpack-plugin"); // remove dead/unused CSS
const glob = require("glob"); // scan folder to be used by PurgeCss in this case
const { merge } = require("webpack-merge"); // imports the merge function from the "webpack-merge" package
const commonConfig = require("./webpack.common"); // imports the configuration settings defined in the "./webpack.common.js" file and assigns it to the commonConfig variable.

const purgePath = {
  src: path.join(__dirname, "src"),
};

module.exports = merge(commonConfig, {
  mode: "production", // prod variable

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"], // MiniCssExtractPlugin: extract CSS from HTML. can prevent flickering when navigating pages/routes
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // MiniCssExtractPlugin: extract CSS from HTML. can prevent flickering when navigating pages/routes
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      // copies files from the 'src' assets folder to the dist assets folder
      patterns: [
        {
          // from: path.resolve(__dirname, "src/assets/images/*"),
          // to: path.resolve(__dirname, "dist"),
          from: path.resolve(__dirname, "src/assets/images"),
          to: path.resolve(__dirname, "dist/assets/images"),
          context: "src",
        },
      ],
    }),
    new PurgeCss({
      //  remove unused CSS
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      safelist: ["dummy-css"], // tells webpack not to delete passed css in form of the object name, '.dummy-css'
    }),
    new MiniCssExtractPlugin(),
  ],
});
