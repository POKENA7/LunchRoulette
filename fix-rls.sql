-- RLSポリシーを修正
DROP POLICY IF EXISTS "Anyone can view shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can insert shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can update shops" ON public.shops;
DROP POLICY IF EXISTS "Anyone can delete shops" ON public.shops;

DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can insert tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can update tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can delete tags" ON public.tags;

DROP POLICY IF EXISTS "Anyone can view shop_tags" ON public.shop_tags;
DROP POLICY IF EXISTS "Anyone can insert shop_tags" ON public.shop_tags;
DROP POLICY IF EXISTS "Anyone can update shop_tags" ON public.shop_tags;
DROP POLICY IF EXISTS "Anyone can delete shop_tags" ON public.shop_tags;

-- パブリックアクセスを許可するポリシーを再作成
CREATE POLICY "Enable all access for shops" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for tags" ON public.tags FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for shop_tags" ON public.shop_tags FOR ALL USING (true) WITH CHECK (true);

-- または、開発中はRLSを一時的に無効化
-- ALTER TABLE public.shops DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tags DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.shop_tags DISABLE ROW LEVEL SECURITY;