# splitmate-free-not-auth
## 1. プロジェクト概要

### 1.1 目的
夫婦・カップル間の月次家計費精算プロセスを自動化・効率化し、手動作業とヒューマンエラーを削減する家計費精算システム

### 1.2 対象ユーザー
- **夫婦・カップル**：精算処理担当者（夫または妻）と精算依頼者（妻または夫）
- **注記**：精算処理担当者と精算依頼者の役割は必要に応じて交換可能

### 1.3 技術スタック
- **フロントエンド**：React + TypeScript + Vite + Tailwind CSS
- **バックエンド**：Node.js + Express + TypeScript
- **データベース**：PostgreSQL（Supabase）
- **インフラ**：Docker, Netlify（フロントエンド）, Render（バックエンド）, Supabase（DB）

## 2. 機能要件

### 2.1 認証・ユーザー管理機能
- 訪問したユーザーに対してランダムな識別子を与える
- 当該識別子を使用したURLが発行され当該URLがユーザーページとなる
- このページは24時間以内に削除される
- 背景：認証機能の実装工数削減。不要なユーザー情報を保持しない設計。当該アプリは月次の精算を完了させられれば良い。バックアップは後続のメール連携ができれば良い。

### 2.2 費用入力・管理機能

#### 2.2.1 費用入力
- **機能**：日常の支出項目入力
- **入力項目**：
  | フィールド | 説明 | 必須 | 例 |
  |-----------|------|-----|---|
  | 説明 | 店舗名または詳細 | ✓ | マルエツ |
  | 金額 | 支出金額 | ✓ | 3,000円 |
  | 支払者 | 実際に支払った人 | ✓ | 夫/妻 |
  | 年月 | 支出年月 | ✓ | 2024年1月 |

#### 2.2.2 費用一覧表示
- **機能**：登録済み費用の一覧表示・管理
- **仕様**：
  - 全費用一覧表示
  - 月次フィルタリング機能
  - 個別削除機能
  - 一括削除機能（チェックボックス選択）
  - 費用編集機能

### 2.3 配分比率設定機能

#### 2.3.1 全体配分比率設定
- **機能**：夫婦間の基本的な費用負担比率設定
- **仕様**：
  - 夫婦それぞれの負担比率設定（合計100%）
  - デフォルト値：夫70% / 妻30%
  - リアルタイム入力検証
  - 比率変更時の全精算自動再計算

#### 2.3.2 個別配分比率設定
- **機能**：特定の費用項目に対する個別比率設定
- **仕様**：
  - 費用単位でのカスタム配分比率
  - 全体比率の上書き機能
  - 個別比率の有効/無効切り替え

### 2.4 精算計算・管理機能

#### 2.4.1 自動精算計算
- **機能**：費用登録時の自動精算計算
- **計算ロジック**：
  1. 配分比率に基づく各自の負担金額計算
  2. 立替者と精算対象者の決定
  3. 精算金額の算出（立替者でない方の負担分）
  4. 精算方向の決定（誰から誰へ）

#### 2.4.2 精算一覧管理
- **機能**：計算済み精算の表示・管理
- **表示項目**：
  - 費用詳細（説明、金額）
  - 配分計算結果（夫負担額、妻負担額）
  - 立替者・精算対象者
  - 精算金額
  - 精算状況（保留/承認/完了）

#### 2.4.3 精算承認・完了機能
- **機能**：精算プロセスの進行管理
- **ワークフロー**：
  1. **保留状態**：計算完了、承認待ち
  2. **承認状態**：双方合意、振込待ち
  3. **完了状態**：振込完了、精算終了

#### 2.4.4 精算検算機能
- **機能**：精算計算過程の詳細表示
- **仕様**：
  - 個別精算の計算根拠表示
  - ステップバイステップの計算プロセス
  - 全体精算の集計計算表示
  - 最終精算方向と金額の確認

## 3. 非機能要件

### 3.1 インフラストラクチャ
- **コンテナ化**：
  - Docker コンテナ使用
  - docker-compose 開発環境
- **クラウド対応**：
  - Netlify（フロントエンド）
  - Render（バックエンド）
  - Supabase（データベース）

### 3.2 保守性要件
#### 3.2.1 コード品質
- **TypeScript使用**：

### 3.3 互換性要件
#### 3.3.1 ブラウザ対応
- **対応ブラウザ**：
  - Chrome（推奨）
  - Safari
- **モバイル対応**：
  - レスポンシブデザイン
  - タッチ操作対応

#### 3.3.2 データベース互換性
- **PostgreSQL**

#### 3.3.3 ディレクトリ構成
- モノレポ構成
```
.
├── README.md
├── backend
│   ├── Dockerfile.postgres.dev
│   ├── Dockerfile.render
│   ├── dist
│   ├── env.example.development
│   ├── env.example.production
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── tsconfig.json
├── docker-compose.postgres.yml
├── docs
├── frontend
│   ├── Dockerfile.dev
│   ├── dist
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── netlify.toml
├── package-lock.json
├── package.json
└── scripts
```

## 4. 今後の拡張予定

### 4.1 通知機能
- メール通知

## 5. 参考資料
- [バイブコーディング with Cursor / Manusでつくる家計精算アプリ：splitmate プロジェクト計画書](https://note.com/studymemot/n/nc1c9e79d6eb8)
- [v1 repo](https://github.com/atsushimemet/splitmate)
- [v2 repo](https://github.com/atsushimemet/splitmate-free)

---

**更新日**: 2025年7月18日
**バージョン**: v1.0.0
