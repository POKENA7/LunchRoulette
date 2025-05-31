# マルチステージビルドを使用して最適化
FROM node:20-slim AS builder

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 全ての依存関係をインストール（devDependenciesも含む）
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 本番用の軽量イメージ
FROM node:20-slim AS runner

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 本番依存関係のみインストール
RUN npm ci --only=production && npm cache clean --force

# ビルド済みファイルをコピー
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# 非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactrouter

# ファイルの所有権を変更
RUN chown -R reactrouter:nodejs /app
USER reactrouter

# ポート3000を公開
EXPOSE 3000

# ヘルスチェック用にcurlをインストール
# RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# ヘルスチェック
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:$PORT/ || exit 1

# アプリケーションを起動
CMD ["npm", "start"]