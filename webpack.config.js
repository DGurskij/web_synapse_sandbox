const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ESlintPlugin = require('eslint-webpack-plugin');

const path = require('path');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const config = {
  entry: {
    'index': path.resolve(__dirname, `./src/index${isDev ? 'Dev' : ''}.ts`),
  },
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, isDev ? 'dist' : 'build'),
    filename: 'index.js',
    libraryTarget: isDev ? 'umd' : 'module',
    module: isProd,
    environment: {
      module: isProd,
    },
    publicPath: '/', // public URL of the output directory when referenced in a browser
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  resolve: {
    roots: [ path.resolve(__dirname) ],
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: path.resolve(__dirname, './src')
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 8091,
    hot: true,
    static: {
      directory: path.resolve(__dirname, './public'),
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
  },
  plugins: [  // Array of plugins to apply to build chunk
    ...(
      isDev
        ? [
          new HtmlWebpackPlugin({
            template: __dirname + "/index.html",
            inject: 'body'
          }),
        ]
        : []
    ),
    // new ESlintPlugin({
    //   extensions: ['ts'],
    //   failOnError: isProd,
    // }),
  ],
  experiments: {
    outputModule: isProd,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
      {
        test: /\.svg/,
        type: "assets/inline"
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      }
    ]
  },
}

module.exports = config;
