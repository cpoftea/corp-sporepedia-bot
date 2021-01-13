const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (args, env) => {
  return {
    entry: './src/start.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      alias: {
        'node-fetch': 'node-fetch/lib/index.js',
      },
    },
    target: 'browserslist',
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /ffmpeg-static$/
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            keep_classnames: /AbortSignal/,
          },
        }),
      ],
    },
  }
}
