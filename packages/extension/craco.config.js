const fs = require('fs');
const path = require('path');

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
          background: './src/chromeServices/background/index.ts'
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
        return {
          ...webpackConfig,
          ...chromeServices
        };
      }
      return {
        ...webpackConfig
      };
    }
  }
};
