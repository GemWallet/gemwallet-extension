const fs = require('fs');
const path = require('path');
const webpack = require("webpack");

const extensionDirectory = fs.realpathSync(process.cwd());
const apiDirectory = path.resolve(extensionDirectory, '../api');
const constantsDirectory = path.resolve(extensionDirectory, '../constants');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.tsx?$/,
        include: [apiDirectory, constantsDirectory],
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json'
        }
      });

      const chromeServices = {
        entry: {
          main: [paths.appIndexJs].filter(Boolean),
          content: './src/chromeServices/content/index.ts',
          background: './src/chromeServices/background/index.ts',
          offscreen: './src/chromeServices/offscreen/index.ts'
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js'
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false
        }
      };

      if (env === 'production') {
        webpackConfig = {
          ...webpackConfig,
          ...chromeServices
        };
      } else {
        webpackConfig = {
          ...webpackConfig
        };
      }

      const fallback = webpackConfig.resolve.fallback || {};
      Object.assign(fallback, {
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify"),
        stream: require.resolve("stream-browserify"),
        url: require.resolve("url"),
        ws: require.resolve("xrpl/dist/npm/client/WSWrapper"),
      });

      webpackConfig.resolve.fallback = fallback;
      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ]);

      // This is deprecated in webpack 5 but alias false does not seem to work
      webpackConfig.module.rules.push({
        test: /node_modules[\\\/]https-proxy-agent[\\\/]/,
        use: "null-loader",
      });

      return webpackConfig;
    }
  }
};
