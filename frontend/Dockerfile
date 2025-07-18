# マルチステージビルド: ビルドステージ
FROM node:18-alpine AS builder

WORKDIR /app

# Package filesをコピーして依存関係をインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# 本番用ビルド実行
RUN npm run build

# 本番ステージ: Nginx
FROM nginx:alpine

# カスタムNginx設定をコピー
COPY nginx.conf /etc/nginx/nginx.conf

# ビルド成果物をNginxのドキュメントルートにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート80を公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"] 
