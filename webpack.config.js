// webpack.config.js
//
// Stage 1 goal: prove this pipeline compiles and runs on its own.
// It does NOT touch js/app.js, js/services/*, js/controllers/*, or
// js/components/* — those stay exactly as-is, loaded the old way via
// plain <script> tags in index.html. This config only knows about
// ./src, a brand-new empty directory reserved for future Angular code.
const path = require('path');

module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '.')
    },
    port: 4300,
    open: false
  },
  devtool: 'source-map'
};
