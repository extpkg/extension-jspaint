const CopyPlugin = require('copy-webpack-plugin')
const path = require('node:path')

module.exports = {
  mode: process.env['NODE_ENV'],
  entry: { main: './src/main.ts', header: './src/header.ts', headerOverlay: './src/header-overlay.ts' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/icons', to: 'icons' },
        { from: 'src/styles', to: 'styles' },
        { from: 'src/extension-jspaint-src', to: 'extension-jspaint-src' },
        { from: 'src/header.html', to: 'header.html' },
        { from: 'src/header-overlay.html', to: 'header-overlay.html' },
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
          path.resolve(__dirname, 'src/extension-jspaint-src')
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
}
