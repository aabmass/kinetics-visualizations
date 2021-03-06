var path = require('path');
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

const buildDir = path.resolve(__dirname, "build");

module.exports = {
  entry: './src/app.js',
  output: {
    path: buildDir,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.pdb$/,
        loader: 'raw'
      }
    ]
  },
  devtool: "source-map",
  devServer: {
    inline: true,
    open: true,
    hot: true,
    outputPath: buildDir
  },
  plugins: [
    // copy the index.html to the build directory
    new CopyWebpackPlugin([
      {
        from: 'index.html',
        to: path.resolve(buildDir, 'index.html')
      }
      ,
      {
        from: 'src/models',
        to: path.resolve(buildDir, 'models')
      }
    ]),
    new webpack.HotModuleReplacementPlugin() 
  ]
};
