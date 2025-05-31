-- サンプルタグを追加
INSERT INTO public.tags (name) VALUES 
  ('近場'),
  ('軽め'),
  ('がっつり'),
  ('雨でも行ける'),
  ('安い'),
  ('おしゃれ')
ON CONFLICT (name) DO NOTHING;

-- サンプル店舗を追加
INSERT INTO public.shops (name, memo, is_blocked) VALUES 
  ('カフェドクリエ', '駅前の便利なカフェ、軽食もあり', false),
  ('牛角', 'お肉をがっつり食べたい時に', false),
  ('サブウェイ', 'ヘルシーなサンドイッチ', false),
  ('吉野家', '早くて安い牛丼', false),
  ('スターバックス', '落ち着いた雰囲気でコーヒー', false)
ON CONFLICT DO NOTHING;