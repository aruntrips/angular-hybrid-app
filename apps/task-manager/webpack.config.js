// apps/task-manager/webpack.config.js
//
// Builds the app shell only - as of Stage 7 there are no specs left
// at this level to compile into a second entry (those moved to
// packages/task-core and packages/task-ui, run via Jest, not
// webpack). `context` is pinned to this directory so entry/output
// paths resolve the same way regardless of which directory `webpack`
// itself is invoked from (nx:run-commands runs it from the repo
// root).
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  context: __dirname,
  entry: {
    bundle: './src/main.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: { configFile: path.resolve(__dirname, 'tsconfig.json') }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // Resolves the '@app/task-core' / '@app/task-ui' aliases declared
    // in tsconfig.base.json, the same way ts-jest's moduleNameMapper
    // does for the package-level unit tests.
    plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, 'tsconfig.json') })]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: {
      directory: __dirname,
      // See Stage 6: without this, chokidar tries to watch every file
      // under node_modules (thousands of them) and hits the OS's
      // per-process open-file limit - EMFILE: too many open files -
      // crashing the dev server on startup.
      watch: { ignored: /node_modules/ }
    },
    port: 4300,
    open: false
  },
  devtool: 'source-map'
};
