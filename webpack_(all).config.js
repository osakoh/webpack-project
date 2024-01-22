const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const PurgeCss = require("purgecss-webpack-plugin"); // remove dead/unused CSS
const glob = require("glob"); // scan folder to be used by PurgeCss in this case

const purgePath = {
  src: path.join(__dirname, "src"),
};

// console.log("purgePath: ", purgePath);

module.exports = {
  entry: {
    index: "./src/index.js",
    courses: "./src/pages/courses.js",
  },
  output: {
    // filename: "[name].bundle.js",
    filename: "[name].[contenthash].js", // helps with browser caching. server only sends request when the hash changes
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: "./dist",
  },
  module: {
    /**
     * style-loader: Inject CSS into the DOM. creates `style` nodes from JS strings. gets the compiled CSS and injects the style into the DOM
     * css-loader: translates CSS into CommonJS
     *  sass-loader: Compiles Sass to CSS
     */
    rules: [
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader"], // MiniCssExtractPlugin: extract CSS from HTML. can prevent flickering when navigating pages/routes
      },
      {
        test: /\.s[ac]ss$/,
        // use: ["style-loader", "css-loader", "sass-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // MiniCssExtractPlugin: extract CSS from HTML. can prevent flickering when navigating pages/routes
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        type: "asset/resource",
      },
      {
        test: /.(ttf|woff|woff2)$/,
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
    new CopyPlugin({
      // copies files from the 'src' assets folder to the dist assets folder
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/images"),
          to: path.resolve(__dirname, "dist/assets/images"),
          context: "src",
        },
      ],
    }),
    // new BundleAnalyzerPlugin({}), // bundle analyzer

    new MiniCssExtractPlugin(),

    //  remove unused CSS
    new PurgeCss({
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      safelist: ["dummy-css"], // tells webpack not to delete passed css in form of the object name, '.dummy-css'
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

// console.log("globOptions: ", globOptions);
