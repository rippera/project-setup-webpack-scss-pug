const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const fs = require('fs');
let templates = [];
let dir = './src/pages';
let files = fs.readdirSync(dir);

files.forEach((file) => {
  if (file.match(/\.pug$/)) {
    let filename = file.substring(0, file.length - 4);
    templates.push(
      new HtmlWebpackPlugin({
        template: dir + '/' + filename + '.pug',
        // hash: true,
        filename: filename + '.html',
      })
    );
  }
});

module.exports = {
  mode: 'development',
  entry: {
    app: './src/js/index.js',
  },
  // watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: './',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.pug$/,
        use: ['raw-loader', 'pug-html-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    open: true,
  },
  plugins: [
    ...templates,
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css',
    }),
  ],
};
