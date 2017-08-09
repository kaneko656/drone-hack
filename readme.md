# Parrot-Mamboをハックする

## 環境

- Mac
- Node.js(6.0以上)

## インストール

- git clone
- `npm install rolling-spider` or `npm install`

## 使い方

- `node index.js`

  - 違う機体を使いたい場合 uuidを変える（index.js -> new RollingSpider() -> uuid）
  - uuidを確認したいとき

    - `node find.js`
    - BLEを発している機器のUUIDが一覧で表示されるので該当するものを探す

- ターミナルでキー操作

  - t: takeoff 離陸
  - l: landing 着陸
  - x: disconnect 通信切断

    - やめたいときに使う

  - 上下左右キー

    - 移動

  - そのほかはコードを見て

- 自動で操作

  - function control(){} 内に記述

## 実装方法

- index.js -> function control(){}に記述する

  - drive.jsを作った

    - 命令をあらかじめセットしておくと順次実行する
    - これを使わないと各命令のコールバックを受け取って次の命令を送るという処理が必要

  - `drive.setDrone(drone)`

    - new RollingSpiderのインスタンスを引数にまず入れる

  - `drive.set('~メソッド名~', options)`

    - メソッドとoptionsについて

      - rolling-spiderのリファレンスをみる

        - <https://www.npmjs.com/package/rolling-spider>

      - 備忘用 rolling-spider.mdをみる

      - コードを参考にする

    - `drive.set('wait', { time: 1000 })` を実装

      - timeミリ秒だけ待つ処理を入れる

  - `drive.do()`

    - setしたメソッドを順次実行
