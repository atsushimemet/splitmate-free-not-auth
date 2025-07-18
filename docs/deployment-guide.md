# SplitMate デプロイガイド

このドキュメントでは、SplitMateアプリケーションを本番環境にデプロイする手順を説明します。

## 現在の構成

- **フロントエンド**: React + TypeScript + Vite
- **データ保存**: localStorage（ブラウザローカル）
- **バックエンド**: 不要（現状）

## デプロイ先

- **フロントエンド**: Netlify
- **バックエンド**: Render（将来的にデータベース実装時）

---

## 1. フロントエンドのNetlifyデプロイ

### 1.1 事前準備

1. **Netlifyアカウントの作成**
   - [Netlify](https://www.netlify.com/)にアクセス
   - GitHubアカウントでサインアップ

2. **ビルド設定の確認**
   ```bash
   cd frontend
   npm run build
   ```

### 1.2 Netlifyでのデプロイ設定

1. **新しいサイトを作成**
   - Netlify Dashboard → "New site from Git"
   - GitHubリポジトリを選択

2. **ビルド設定**
   ```
   Build command: npm run build
   Publish directory: frontend/dist
   Base directory: frontend
   ```

3. **環境変数設定**（必要に応じて）
   - Site settings → Environment variables
   - 現在は不要（localStorageベース）

### 1.3 カスタムドメイン設定（オプション）

1. **ドメイン設定**
   - Site settings → Domain management
   - Custom domainを追加

2. **SSL設定**
   - 自動的にLet's Encryptが設定される

### 1.4 デプロイの確認

- デプロイURL: `https://[site-name].netlify.app`
- 動作確認項目：
  - [ ] 費用入力機能
  - [ ] 配分比率設定
  - [ ] 精算管理・承認
  - [ ] 精算サマリー表示
  - [ ] LINE共有テキスト機能
  - [ ] 識別子別データ分離

---

## 2. バックエンドのRenderデプロイ（将来対応）

> **注意**: 現在はlocalStorageベースのため、バックエンドは不要です。
> 将来的にデータベース機能を追加する場合の手順です。

### 2.1 バックエンド実装時の準備

1. **バックエンドディレクトリ作成**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. **必要な依存関係**
   ```bash
   npm install express cors helmet dotenv
   npm install -D typescript @types/node @types/express
   ```

### 2.2 Renderでのデプロイ設定

1. **Renderアカウント作成**
   - [Render](https://render.com/)にアクセス
   - GitHubアカウントでサインアップ

2. **新しいWebサービス作成**
   - Dashboard → "New Web Service"
   - GitHubリポジトリを選択

3. **ビルド設定**
   ```
   Name: splitmate-backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **環境変数設定**
   ```
   NODE_ENV=production
   DATABASE_URL=[データベース接続文字列]
   JWT_SECRET=[JWTシークレット]
   ```

### 2.3 データベース設定

1. **PostgreSQL Database作成**
   - Render Dashboard → "New PostgreSQL"
   - データベース名: `splitmate-db`

2. **接続情報の設定**
   - Database URLを環境変数に設定

---

## 3. デプロイ後の設定

### 3.1 フロントエンドの環境変数更新

将来的にバックエンドを実装する場合：

```bash
# .env.production
VITE_API_BASE_URL=https://splitmate-backend.onrender.com
```

### 3.2 CORS設定

バックエンド実装時にCORS設定が必要：

```javascript
// backend/src/app.js
const cors = require('cors');

const corsOptions = {
  origin: ['https://splitmate.netlify.app', 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 4. 継続的デプロイメント（CI/CD）

### 4.1 Netlifyの自動デプロイ

- `main`ブランチへのpushで自動デプロイ
- プレビューデプロイ（プルリクエスト）

### 4.2 Renderの自動デプロイ

- `main`ブランチへのpushで自動デプロイ
- ビルドログの確認

---

## 5. モニタリング・メンテナンス

### 5.1 パフォーマンス監視

- Netlify Analytics
- Render Metrics（バックエンド実装時）

### 5.2 エラー監視

- ブラウザコンソールエラーの確認
- Renderログ監視（バックエンド実装時）

### 5.3 アップデート手順

1. **開発環境での検証**
2. **staging環境でのテスト**（オプション）
3. **本番環境へのデプロイ**

---

## 6. トラブルシューティング

### 6.1 よくある問題

1. **ビルドエラー**
   ```bash
   # 依存関係の問題
   npm ci
   npm run build
   ```

2. **ルーティング問題**
   - Netlifyの`_redirects`ファイル設定
   ```
   /* /index.html 200
   ```

3. **環境変数の問題**
   - Netlifyの環境変数設定を確認
   - `VITE_`プレフィックスが必要

### 6.2 ログの確認方法

- **Netlify**: Deploy log, Function log
- **Render**: Application log, Build log

---

## 7. セキュリティ考慮事項

### 7.1 現在の実装

- クライアントサイドのみ（localStorage）
- HTTPSによる通信暗号化（Netlify）
- 識別子ベースのデータ分離

### 7.2 バックエンド実装時の追加考慮

- JWT認証の実装
- APIレート制限
- 入力値検証・サニタイゼーション
- SQLインジェクション対策

---

## 参考リンク

- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)
- [Vite Build Guide](https://vitejs.dev/guide/build.html) 
