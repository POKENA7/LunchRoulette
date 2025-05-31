import { Link, useLoaderData } from "react-router";
import { getAllShops, deleteShop, toggleShopBlock } from "../lib/shops";

interface ActionArgs {
  request: Request;
}

export async function loader() {
  const shops = await getAllShops();
  return { shops };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  const shopId = formData.get("shopId") as string;

  try {
    if (action === "delete") {
      await deleteShop(shopId);
    } else if (action === "toggleBlock") {
      const isBlocked = formData.get("isBlocked") === "true";
      await toggleShopBlock(shopId, !isBlocked);
    }
    return null;
  } catch (error) {
    return { error: "操作に失敗しました" };
  }
}

export default function Shops() {
  const { shops } = useLoaderData<typeof loader>();

  const tagColors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-purple-100 text-purple-800",
    "bg-red-100 text-red-800",
    "bg-yellow-100 text-yellow-800",
    "bg-indigo-100 text-indigo-800",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            ← 戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-800">お店管理</h1>
          <Link
            to="/shops/add"
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
          >
            + 追加
          </Link>
        </header>

        <div className="space-y-3">
          {shops.length > 0 ? (
            shops.map((shop, index) => (
              <div
                key={shop.id}
                className={`bg-white rounded-lg shadow p-4 ${shop.is_blocked ? "opacity-50" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800">
                    {shop.name}
                    {shop.is_blocked && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        除外中
                      </span>
                    )}
                  </h3>
                  <div className="relative group">
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-24 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <form method="post" className="inline">
                        <input
                          type="hidden"
                          name="action"
                          value="toggleBlock"
                        />
                        <input type="hidden" name="shopId" value={shop.id} />
                        <input
                          type="hidden"
                          name="isBlocked"
                          value={shop.is_blocked.toString()}
                        />
                        <button
                          type="submit"
                          className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                        >
                          {shop.is_blocked ? "除外解除" : "除外"}
                        </button>
                      </form>
                      <form method="post" className="inline">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="shopId" value={shop.id} />
                        <button
                          type="submit"
                          className="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-gray-100"
                          onClick={(e) => {
                            if (!confirm("このお店を削除しますか？")) {
                              e.preventDefault();
                            }
                          }}
                        >
                          削除
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                {shop.memo && (
                  <p className="text-sm text-gray-600 mb-2">{shop.memo}</p>
                )}
                {shop.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {shop.tags.map((tag, tagIndex) => (
                      <span
                        key={tag.id}
                        className={`text-xs px-2 py-1 rounded ${tagColors[tagIndex % tagColors.length]}`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🏪</div>
              <p>お店を追加してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
