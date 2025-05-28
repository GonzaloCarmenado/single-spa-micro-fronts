const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/root-config.js',
  output: {
    filename: 'main.js',
    publicPath: '/',
    libraryTarget: 'system',
  },
  mode: 'development',
  devServer: {
    port: 9000,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
    }),
  ],
  externals: ['main-angular-app-1', 'angular-app-2'],
};
