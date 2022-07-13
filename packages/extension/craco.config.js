const path = require('path');
const fs = require('fs');

const extensionDirectory = fs.realpathSync(process.cwd());
const apiDirectory = path.resolve(extensionDirectory, '../api');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.push({
        test: /\.tsx?$/,
        include: [apiDirectory],
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          configFile: 'tsconfig.json'
        }
      });
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs
          ].filter(Boolean),
          content: './src/chromeServices/content.ts',
          background: './src/chromeServices/background.ts'
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
    }
  }
};
