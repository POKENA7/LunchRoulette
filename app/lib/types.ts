export interface Shop {
  id: string;
  name: string;
  memo?: string;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface ShopTag {
  id: string;
  shop_id: string;
  tag_id: string;
  created_at: string;
}

export interface ShopWithTags extends Shop {
  tags: Tag[];
}
