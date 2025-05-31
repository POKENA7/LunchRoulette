import { Form, Link, redirect, useLoaderData } from "react-router";
import { getAllTags, createShop, createTag } from "../lib/shops";

interface ActionArgs {
  request: Request;
}

export async function loader() {
  const tags = await getAllTags();
  return { tags };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const memo = formData.get("memo") as string;
  const selectedTags = formData.getAll("tags") as string[];
  const newTag = formData.get("newTag") as string;

  if (!name) {
    return { error: "お店の名前は必須です" };
  }

  try {
    let tagIds = [...selectedTags];

    // 新しいタグがある場合は作成
    if (newTag) {
      const tag = await createTag(newTag);
      tagIds.push(tag.id);
    }

    await createShop(name, memo || undefined, tagIds);
    return redirect("/shops");
  } catch (error) {
    return { error: "お店の登録に失敗しました" };
  }
}

export default function AddShop() {
  const { tags } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Link to="/shops" className="text-gray-600 hover:text-gray-800">
            ← 戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-800">お店を追加</h1>
          <div className="w-12"></div>
        </header>

        <Form method="post" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お店の名前 *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="お店の名前を入力"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ
            </label>
            <textarea
              name="memo"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="お店の説明やメモ（任意）"
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            <div className="space-y-2 mb-3">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="tags"
                    value={tag.id}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
            <input
              type="text"
              name="newTag"
              placeholder="新しいタグを追加"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            お店を追加
          </button>
        </Form>
      </div>
    </div>
  );
}
