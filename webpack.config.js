// webpack.config.js
//
// Two entries: 'bundle' is the real app (loaded by index.html),
// 'spec-bundle' compiles the TypeScript Jasmine specs under spec/ so
// SpecRunner.html can load them as a plain <script> too — TS specs
// need this since browsers can't run .ts files directly.
const path = require('path');

module.exports = {
  entry: {
    bundle: './src/main.ts',
    'spec-bundle': './spec/task.service.spec.ts'
  },
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
    filename: '[name].js',
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
