// webpack.config.js
//
// Two entries: 'bundle' is the real app (loaded by index.html),
// 'spec-bundle' compiles the TypeScript Jasmine specs under spec/ so
// SpecRunner.html can load them as a plain <script> too — TS specs
// need this since browsers can't run .ts files directly. As of
// Stage 5, all specs are TypeScript, so 'spec-bundle' is an array of
// every spec file - webpack concatenates array entries into one
// output bundle.
const path = require('path');

module.exports = {
  entry: {
    bundle: './src/main.ts',
    'spec-bundle': ['./spec/task.service.spec.ts', './spec/task-list.component.spec.ts']
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
      directory: path.resolve(__dirname, '.'),
      // `directory` is the whole project root (so index.html/css/ are
      // reachable), and dev-server watches it recursively by default -
      // which means node_modules too. Watching every file under
      // node_modules (thousands of them, e.g. all of
      // @angular/common/locales/) hits the OS's per-process open-file
      // limit - EMFILE: too many open files - crashing the dev server
      // on startup. Nothing in node_modules changes during a dev
      // session anyway, so exclude it from the watch.
      watch: { ignored: /node_modules/ }
    },
    port: 4300,
    open: false
  },
  devtool: 'source-map'
};
