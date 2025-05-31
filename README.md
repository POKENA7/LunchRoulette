# 🎯 Lunch Roulette

ランチ選び支援PWAアプリ - 今日のランチをルーレットで決めよう！

## ✨ 機能

- **お店管理** - お店の登録・編集・削除
- **タグ機能** - 「近場」「軽め」「がっつり」などでお店を分類
- **ルーレット機能** - ランダムにお店を選択（アニメーション付き）
- **フィルタリング** - タグでお店を絞り込み
- **除外機能** - 一時的にお店を候補から除外
- **PWA対応** - スマホのホーム画面に追加可能
- **モバイルファースト** - スマホでの使いやすさを重視

## 🛠️ 技術スタック

- **フロントエンド**: React Router v7 + TypeScript + Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **フォーム**: Conform
- **リンター**: Biome
- **デプロイ**: Google Cloud Run対応

## 🚀 セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **環境変数の設定**
   `.env`ファイルを作成し、以下を設定：
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   DATABASE_URL=your_database_url
   ```

3. **データベースセットアップ**
   SupabaseのSQL Editorで`setup-tables.sql`を実行

4. **開発サーバー起動**
   ```bash
   npm run dev
   ```

## 📱 PWA機能

- マニフェストファイル設定済み
- Service Worker によるオフライン対応
- スマホのホーム画面に追加可能

## 🎮 使い方

1. **お店登録**: 「お店管理」→「+ 追加」でお店とタグを登録
2. **ルーレット**: ホーム画面で「ルーレットを回す」ボタンをクリック
3. **フィルタリング**: タグを選択してお店を絞り込み
4. **除外**: お店の「⋮」メニューから一時的に除外

## 🏗️ ビルド・デプロイ

```bash
# 本番ビルド
npm run build

# 型チェック
npm run typecheck

# リント・フォーマット
npm run lint
npm run format
```

## 📝 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run typecheck    # TypeScript型チェック
npm run lint         # Biomeリント
npm run format       # Biomeフォーマット
npm run db:generate  # Drizzle スキーマ生成
npm run db:push      # Drizzle スキーマプッシュ
```