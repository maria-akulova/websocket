
import { resolve } from 'node:path';
import webpack from 'webpack';

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  target: 'node',
  mode: isProduction ? 'production' : 'development',
  entry: resolve(__dirname, 'index.ts'),
  output: {
    clean: true,
    filename: 'index.js',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^(bufferutil|utf-8-validate)$/,
        }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: { extensions: ['.ts', '.js'] },

};

export default config;
