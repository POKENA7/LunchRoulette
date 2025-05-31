import { Link, Form, useLoaderData } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { getAllTags, createTag } from "../lib/shops";
import { supabase } from "../lib/supabase";

export async function loader() {
  const allTags = await getAllTags();
  return { tags: allTags };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const name = formData.get("name") as string;
    if (name?.trim()) {
      await createTag(name.trim());
    }
  } else if (intent === "delete") {
    const tagId = formData.get("tagId") as string;
    if (tagId) {
      const { error } = await supabase.from("tags").delete().eq("id", tagId);
      if (error) throw error;
    }
  }

  return null;
}

export default function Settings() {
  const loaderData = useLoaderData<typeof loader>();
  const allTags = loaderData?.tags || [];
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            ← 戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-800">設定</h1>
          <div className="w-12"></div>
        </header>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-800">タグ管理</h2>
            </div>
            <div className="p-4">
              <div className="flex gap-2 flex-wrap mb-3">
                {allTags.map((tag, index) => {
                  const colorClasses = [
                    "bg-blue-100 text-blue-800",
                    "bg-green-100 text-green-800",
                    "bg-red-100 text-red-800",
                    "bg-purple-100 text-purple-800",
                    "bg-yellow-100 text-yellow-800",
                    "bg-pink-100 text-pink-800",
                    "bg-indigo-100 text-indigo-800",
                    "bg-gray-100 text-gray-800",
                  ];
                  const colorClass = colorClasses[index % colorClasses.length];

                  return (
                    <div
                      key={tag.id}
                      className={`${colorClass} text-sm px-3 py-1 rounded-full flex items-center gap-1`}
                    >
                      <span>{tag.name}</span>
                      <Form method="post" className="inline">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="tagId" value={tag.id} />
                        <button
                          type="submit"
                          className="ml-1 hover:bg-black/10 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                          title="削除"
                        >
                          ×
                        </button>
                      </Form>
                    </div>
                  );
                })}
              </div>

              <Form method="post" className="flex gap-2 items-center">
                <input type="hidden" name="intent" value="create" />
                <input
                  type="text"
                  name="name"
                  placeholder="新しいタグ名"
                  className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                  required
                />
                <button
                  type="submit"
                  className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-600 rounded hover:bg-orange-50"
                >
                  追加
                </button>
              </Form>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-800">除外リスト</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                一時的に候補から除外したいお店
              </p>
              <p className="text-sm text-gray-400">除外中のお店はありません</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
