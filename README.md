# 東方ナンバーグレイズ

ソースコード置き場

## 著作権等

本作品は東方 Project の二次創作です。

<u>**MIT ライセンスが適用されるのはプログラム部分のみ**</u>であり、キャラクターや世界観等については下記の方々が著作権を保有しています。二次利用等については、それぞれの作者様の意向に従ってください。

- [素材等の著作権についてはこちら](https://github.com/kuinaein/TohoNumberGlaze-assets)

プログラム部分につきましては、ヘッダコメント等で特に断りのない限り、[MIT ライセンス](./LICENSE)に基づきご利用いただけます。

## 開発環境・動作検証環境

- Android 8.0 (Xperia XZ SO-01J)
  - エミュレータ上では Android 7.0 でも動作確認済
- Android SDK 26.x
- Cordova 8.x
- Cocos2d-x 3.x
- Node.js 10.x
- Antergos (Arch Linux 系)

## ビルド手順

1. `git submodule update --init --recursive`
1. `npm install`
1. `cd src`
1. `yarn install`
1. `yarn build`
   - `yarn dev`で PC ブラウザ上での動作確認可
   - <u>エミュレータを起動した上で</u>`yarn emu`で動作確認可
1. `cordova build android --device --release -- --keystore=xxx --storePassword=xxx --alias=xxx --password=xxx`
