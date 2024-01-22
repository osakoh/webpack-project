const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: "./src/index.js",
    courses: "./src/pages/courses.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: "asset/resource", // handling and optimization of various assets like images, fonts, stylesheets, and other non-JavaScript files in a web application.
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      // adds non-CommonJS/ES6 modules into the webpack build, to ensure compatibility and proper functionality.
      mnt: "moment",
      $: "jquery",
    }),
    new HtmlWebpackPlugin({
      // creates the HTML and automatically inject the 'script' tags into the 'body' or 'head'. updates the 'src' attribute of 'link' tags for your CSS bundles
      template: "./src/index.html",
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      // creates the HTML and automatically inject the 'script' tags into the 'body' or 'head'. updates the 'src' attribute of 'link' tags for your CSS bundles
      template: "./src/pages/courses.html",
      chunks: ["courses"],
      filename: "courses.html",
      base: "pages",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
