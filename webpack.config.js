const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')

module.exports = {
  mode: process.env['NODE_ENV'],
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/icons', to: 'icons' },
        { from: 'src/styles', to: 'styles' },
        { from: 'src/jspaint', to: 'jspaint' },
        { from: 'src/header.html', to: 'header.html' },
        { from: 'src/manifest.json', to: 'manifest.json' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: [
          '/node_modules/',
          path.resolve(__dirname, 'src/jspaint')
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
}
