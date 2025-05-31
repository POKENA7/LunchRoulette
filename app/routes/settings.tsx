import { Link, useLoaderData, Form } from "react-router";
import { db } from "~/lib/db";
import { tags } from "~/lib/schema";
import { eq } from "drizzle-orm";
import type { Tag } from "~/lib/types";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

export async function loader() {
  const allTags = await db.select().from(tags).orderBy(tags.createdAt);
  return { tags: allTags };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const tagName = formData.get("tagName") as string;
    if (tagName?.trim()) {
      try {
        await db.insert(tags).values({ name: tagName.trim() });
      } catch (error) {
        // Tag already exists (unique constraint)
        console.error("Tag already exists:", error);
      }
    }
  } else if (intent === "delete") {
    const tagId = formData.get("tagId") as string;
    if (tagId) {
      await db.delete(tags).where(eq(tags.id, tagId));
    }
  }

  return redirect("/settings");
}

export default function Settings() {
  const { tags: tagList } = useLoaderData<typeof loader>();

  const tagColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800", 
    "bg-red-100 text-red-800",
    "bg-purple-100 text-purple-800",
    "bg-yellow-100 text-yellow-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];

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
                {tagList.map((tag, index) => (
                  <div key={tag.id} className="flex items-center gap-1">
                    <span className={`text-sm px-3 py-1 rounded-full ${tagColors[index % tagColors.length]}`}>
                      {tag.name}
                    </span>
                    <Form method="post" className="inline">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="tagId" value={tag.id} />
                      <button
                        type="submit"
                        className="text-gray-400 hover:text-red-500 text-xs font-bold w-4 h-4 flex items-center justify-center"
                        title="削除"
                      >
                        ×
                      </button>
                    </Form>
                  </div>
                ))}
                {tagList.length === 0 && (
                  <p className="text-sm text-gray-400">タグが登録されていません</p>
                )}
              </div>
              <Form method="post" className="flex gap-2">
                <input type="hidden" name="intent" value="add" />
                <input
                  type="text"
                  name="tagName"
                  placeholder="新しいタグ名"
                  className="flex-1 text-sm px-3 py-1 border rounded"
                  maxLength={100}
                  required
                />
                <button
                  type="submit"
                  className="text-sm text-orange-600 hover:text-orange-700 px-2"
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
