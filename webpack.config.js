const path = require('path');

module.exports = {
  entry: './run.js',
  mode: 'production',
  target: 'node',
  output: {
    filename: 'httpServer.min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: true,
  },
};
