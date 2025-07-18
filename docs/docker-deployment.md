# SplitMate Dockerデプロイガイド

Dockerコンテナを使用してSplitMateを本番環境にデプロイする手順を説明します。

## Docker構成

### 開発環境
- **Dockerfile**: `frontend/Dockerfile.dev`
- **用途**: ホットリロード対応の開発サーバー
- **ポート**: 3000

### 本番環境
- **Dockerfile**: `frontend/Dockerfile`
- **用途**: Nginx + 静的ファイル配信
- **ポート**: 80

---

## 1. Renderでのデプロイ（推奨）

### 1.1 事前準備

1. **[Render](https://render.com/)**にGitHubでサインアップ

2. **本番用ビルドをローカルでテスト**
   ```bash
   cd frontend
   docker build -t splitmate-prod .
   docker run -p 8080:80 splitmate-prod
   ```
   → http://localhost:8080 で動作確認

### 1.2 Renderでのデプロイ設定

1. **Web Serviceを作成**
   - Render Dashboard → **"New Web Service"**
   - GitHubリポジトリを選択

2. **デプロイ設定**
   ```
   Name: splitmate-app
   Root Directory: frontend
   Environment: Docker
   Dockerfile Path: ./Dockerfile
   Port: 80
   ```

3. **環境変数**（必要に応じて）
   ```
   NODE_ENV=production
   ```

4. **デプロイ実行**
   - **"Create Web Service"** をクリック
   - 自動ビルド・デプロイが開始

### 1.3 デプロイ確認

- **デプロイURL**: `https://[app-name].onrender.com`
- **動作確認項目**:
  - [ ] ルート→識別子リダイレクト
  - [ ] 費用入力・精算機能
  - [ ] SPA ルーティング
  - [ ] LINE共有機能

---

## 2. Railwayでのデプロイ

### 2.1 事前準備

1. **[Railway](https://railway.app/)**にGitHubでサインアップ

### 2.2 デプロイ設定

1. **プロジェクト作成**
   - "New Project" → "Deploy from GitHub repo"

2. **設定（自動認識）**
   ```
   Framework: Static Site
   Build Command: (Dockerfileから自動検出)
   Root Directory: frontend
   ```

3. **ポート設定**
   ```bash
   PORT=80
   ```

---

## 3. Google Cloud Runでのデプロイ

### 3.1 事前準備

```bash
# Google Cloud SDKインストール
gcloud auth login
gcloud config set project [PROJECT_ID]
```

### 3.2 デプロイ手順

```bash
# Cloud Runにデプロイ
cd frontend
gcloud run deploy splitmate \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

---

## 4. ローカルでの本番環境テスト

### 4.1 本番用ビルド

```bash
cd frontend
docker build -t splitmate-prod .
```

### 4.2 本番環境実行

```bash
# ポート8080でテスト
docker run -p 8080:80 splitmate-prod

# バックグラウンド実行
docker run -d -p 8080:80 --name splitmate splitmate-prod
```

### 4.3 動作確認

- **URL**: http://localhost:8080
- **停止**: `docker stop splitmate`
- **削除**: `docker rm splitmate`

---

## 5. 技術的詳細

### 5.1 Dockerファイル構成

```dockerfile
# マルチステージビルド
FROM node:18-alpine AS builder  # ビルドステージ
FROM nginx:alpine              # 本番ステージ
```

### 5.2 Nginx設定

- **SPA対応**: `try_files $uri $uri/ /index.html`
- **Gzip圧縮**: 有効
- **キャッシュ**: 静的ファイル1年
- **セキュリティヘッダー**: 適用済み

### 5.3 最適化

- **ビルドサイズ**: マルチステージで最小化
- **依存関係**: `npm ci --only=production`
- **除外ファイル**: `.dockerignore`で不要ファイル除外

---

## 6. 比較表

| プラットフォーム | 無料枠 | 難易度 | 推奨度 |
|----------------|--------|--------|---------|
| **Render**     | あり   | 簡単   | ⭐⭐⭐ |
| **Railway**    | あり   | 簡単   | ⭐⭐ |
| **Cloud Run**  | 制限付き | 中級 | ⭐⭐ |

---

## 7. トラブルシューティング

### 7.1 よくある問題

1. **ポートエラー**
   ```
   Error: Port already in use
   → docker stop $(docker ps -q)
   ```

2. **ビルドエラー**
   ```bash
   # キャッシュクリア
   docker builder prune
   docker build --no-cache -t splitmate-prod .
   ```

3. **SPA ルーティング問題**
   - Nginx設定の確認
   - `try_files`ディレクティブの動作確認

### 7.2 ログ確認

```bash
# コンテナログ確認
docker logs [container_id]

# Render ログ確認
Render Dashboard → Service → Logs
```

---

## 8. 本番環境の注意事項

### 8.1 セキュリティ

- HTTPSの確認（Render/Railway自動設定）
- セキュリティヘッダーの動作確認
- 識別子ベースのデータ分離

### 8.2 パフォーマンス

- Gzip圧縮の確認
- 静的ファイルキャッシュの動作
- CDN設定（オプション）

---

## 参考リンク

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/) 
