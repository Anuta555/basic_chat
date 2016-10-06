var webpack = require('webpack');
module.exports = {
  entry: './views/chat.js',
  output: {
    path: __dirname + '/views',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
    ],
    loaders: [
      { test: /\.css$/, loader: "style!css" },
    ]
  }
};
