const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './run.js',
  output: {
    filename: './dist/httpServer.min.js',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};
