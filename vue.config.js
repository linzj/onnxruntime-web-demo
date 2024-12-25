const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-import")(),
          require("postcss-cssnext")({ browsers: [">0.5%"] }),
        ],
      },
    },
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/onnxruntime-web-demo/" : "/",
  outputDir: "docs",
  productionSourceMap: true,
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.optimization.minimize(false); // Disable minification in development
    }
  },
  configureWebpack: {
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /node_modules\/(?!onnxruntime-web)/, // Do NOT apply babel-loader to onnxruntime-web
          ],
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "> 0.25%, not dead", // Make sure this matches your target browser environment
                    useBuiltIns: "entry", // If you need polyfills
                    corejs: 3, // Ensure core-js is available
                    modules: false, // This prevents Babel from transforming ES modules (important for tree-shaking)
                  },
                ],
              ],
              plugins: ["@babel/plugin-proposal-optional-chaining"],
            },
          },
        },
        {
          test: /\.ts$/,
          exclude: /node_modules\/(?!onnxruntime-web)/, // Exclude onnxruntime-web from ts-loader
          loader: "ts-loader",
          options: {
            transpileOnly: true, // Optional: Skip type checking for performance
          },
        },
      ],
    },
  },
  devServer: {
    before(app) {
      // Add a middleware to set the correct MIME type for `.mjs` files
      app.use((req, res, next) => {
        if (req.url.endsWith(".mjs")) {
          res.setHeader("Content-Type", "application/javascript");
        }
        next();
      });
    },
    contentBase: [
      path.join(__dirname, "public"),
      path.join(__dirname, "path/to/onnxruntime-web/files"), // Adjust this path as needed
    ],
    host: "0.0.0.0",
  },
};
