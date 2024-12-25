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
              presets: ["@babel/preset-env"],

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
};

