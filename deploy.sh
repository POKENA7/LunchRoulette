#!/bin/bash

# Google Cloud Runへのデプロイスクリプト（Artifact Registry 対応）

set -e

# 設定
PROJECT_ID=${1:-"your-project-id"}
SERVICE_NAME="lunch-roulette"
REGION="asia-northeast1"
REPOSITORY_NAME="lunch-roulette-repo"
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/$SERVICE_NAME"

echo "🚀 Lunch Roulette をGoogle Cloud Runにデプロイします..."
echo "プロジェクトID: $PROJECT_ID"
echo "リージョン: $REGION"

# 1. Google Cloud プロジェクトを設定
echo "📋 Google Cloud プロジェクトを設定中..."
gcloud config set project $PROJECT_ID

# 2. 必要なAPIを有効化
echo "🔧 必要なAPIを有効化中..."
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 3. Artifact Registry リポジトリ作成（存在しない場合）
echo "📦 Artifact Registry リポジトリを作成（または既存のものを使用）..."
gcloud artifacts repositories describe $REPOSITORY_NAME --location=$REGION >/dev/null 2>&1 || \
gcloud artifacts repositories create $REPOSITORY_NAME \
  --repository-format=docker \
  --location=$REGION \
  --description="Lunch Roulette Docker Repository"

# 4. Dockerイメージをビルド
echo "🏗️ Dockerイメージをビルド中..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

# 5. Artifact Registry にプッシュ
echo "📤 Artifact Registry にプッシュ中..."
docker push $IMAGE_NAME

# 6. 環境変数を読み込み
if [ -f .env ]; then
    echo "📝 環境変数を読み込み中..."
    export $(cat .env | xargs)
else
    echo "⚠️  .envファイルが見つかりません。手動で環境変数を設定してください。"
fi

# 7. Cloud Runにデプロイ
echo "🚢 Cloud Runにデプロイ中..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars "SUPABASE_URL=$SUPABASE_URL,SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY,DATABASE_URL=$DATABASE_URL" \
    --max-instances 10 \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300

# 8. デプロイされたURLを取得
URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ デプロイ完了！"
echo "🌐 URL: $URL"
