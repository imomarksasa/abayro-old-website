const webpack = require('webpack');
const config = {
  mode: 'production',
  entry: './main.js',
  
  output: {
    path: __dirname + '/dist',
    filename: 'abayro.bundle.js'
  },
   optimization: {
       splitChunks: {
         chunks: 'all'
       }
     },
  module:{
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
  ]

}

module.exports = config;