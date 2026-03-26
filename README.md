# 酒蔵OEM見積ツール

日本酒酒蔵のOEM受託案件向けに、見積金額を素早く作成するためのシンプルなWebツールです。

## できること

- 本数、容量、歩留まりロスから必要酒液量を算出
- 瓶、キャップ、ラベル、箱、充填、品質検査、物流などの変動費を反映
- 試作費、デザイン費、進行管理費などの固定費を反映
- 利益率と消費税率を加味して税抜・税込見積額を計算
- CSV出力、印刷、入力内容のローカル保存

## 使い方

1. `index.html` をブラウザで開きます。
2. 案件条件と原価条件を入力します。
3. 右下の見積プレビューと内訳を確認します。
4. 必要に応じて `CSV出力` または `印刷` を使います。

## GitHub Pages

このリポジトリには GitHub Pages 用の workflow を追加してあります。

1. GitHub のリポジトリ設定で `Settings > Pages` を開きます。
2. `Build and deployment` の `Source` を `GitHub Actions` にします。
3. `main` ブランチへ push すると `Deploy GitHub Pages` workflow が走ります。
4. 公開URLは通常 `https://yuuuuuuuuki01.github.io/oem/` です。

この URL はユーザー名 `yuuuuuuuuki01` とリポジトリ名 `oem` からの推定です。

## ファイル構成

- `index.html`: 画面
- `style.css`: スタイル
- `app.js`: 計算ロジックと画面更新
- `.github/workflows/deploy-pages.yml`: GitHub Pages デプロイ

## 補足

- 入力値はブラウザの `localStorage` に保存されます。
- 依存パッケージは使っていないので、そのまま静的ホスティングできます。
