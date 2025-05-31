import { supabase } from "./supabase";
import type { Shop, Tag, ShopWithTags } from "./types";

export async function getAllShops(): Promise<ShopWithTags[]> {
  // まず店舗を取得
  const { data: shops, error } = await supabase
    .from("shops")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  if (!shops || shops.length === 0) {
    return [];
  }

  // 各店舗のタグを個別に取得
  const shopsWithTags: ShopWithTags[] = [];

  for (const shop of shops) {
    // shop_tagsテーブルから店舗IDで絞り込み
    const { data: shopTagLinks } = await supabase
      .from("shop_tags")
      .select("tag_id")
      .eq("shop_id", shop.id);

    // タグIDの配列を取得
    const tagIds = shopTagLinks?.map((link) => link.tag_id) || [];

    // 各タグの詳細を取得
    const tags: Tag[] = [];
    if (tagIds.length > 0) {
      const { data: tagDetails } = await supabase
        .from("tags")
        .select("*")
        .in("id", tagIds);

      tags.push(...(tagDetails || []));
    }

    shopsWithTags.push({
      ...shop,
      tags,
    });
  }

  return shopsWithTags;
}

export async function createShop(
  name: string,
  memo?: string,
  tagIds: string[] = [],
): Promise<Shop> {
  const { data: shop, error } = await supabase
    .from("shops")
    .insert({ name, memo, is_blocked: false })
    .select()
    .single();

  if (error) throw error;

  // タグを関連付け
  if (tagIds.length > 0) {
    const shopTags = tagIds.map((tagId) => ({
      shop_id: shop.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("shop_tags")
      .insert(shopTags);

    if (tagError) throw tagError;
  }

  return shop;
}

export async function updateShop(
  id: string,
  name: string,
  memo?: string,
): Promise<Shop> {
  const { data: shop, error } = await supabase
    .from("shops")
    .update({ name, memo, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return shop;
}

export async function deleteShop(id: string): Promise<void> {
  const { error } = await supabase.from("shops").delete().eq("id", id);

  if (error) throw error;
}

export async function toggleShopBlock(
  id: string,
  isBlocked: boolean,
): Promise<Shop> {
  const { data: shop, error } = await supabase
    .from("shops")
    .update({ is_blocked: isBlocked, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return shop;
}

export async function getAllTags(): Promise<Tag[]> {
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("name");

  if (error) throw error;
  return tags || [];
}

export async function createTag(name: string): Promise<Tag> {
  const { data: tag, error } = await supabase
    .from("tags")
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return tag;
}

export async function getShopsByTags(
  tagIds: string[],
  excludeBlocked = true,
): Promise<ShopWithTags[]> {
  // 全ての店舗を取得してフィルタリング
  const allShops = await getAllShops();

  let filteredShops = allShops;

  // ブロックされた店舗を除外
  if (excludeBlocked) {
    filteredShops = filteredShops.filter((shop) => !shop.is_blocked);
  }

  // タグIDで絞り込み
  if (tagIds.length > 0) {
    filteredShops = filteredShops.filter((shop) =>
      shop.tags.some((tag) => tagIds.includes(tag.id)),
    );
  }

  return filteredShops;
}
