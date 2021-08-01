const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  output: {
    path: `${__dirname}/dist`,
    filename: "index.js"
  },
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: './index.ts',

  module: {
    rules: [{
      // 拡張子 .ts の場合
      test: /\.ts$/,
      exclude: /(node_modules|dist)/,
      // TypeScript をコンパイルする
      use: [
        {
          loader: 'ts-loader',
        },
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
            ]
          }
        }
      ],
    },
    ],
  },
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  // フロントエンドの開発では拡張子を省略することが多いので、
  // 記載したほうがトラブルに巻き込まれにくい。
  resolve: {
    // 拡張子を配列で指定
    extensions: [
      '.ts', '.js',
    ],
  },
};
