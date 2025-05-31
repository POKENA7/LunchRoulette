import { Link, useLoaderData, useSearchParams } from "react-router";
import { getAllShops, getAllTags, getShopsByTags } from "../lib/shops";
import { useState } from "react";

interface LoaderArgs {
  request: Request;
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const selectedTagIds = url.searchParams.getAll("tags");

  const [tags, shops] = await Promise.all([
    getAllTags(),
    selectedTagIds.length > 0 ? getShopsByTags(selectedTagIds) : getAllShops(),
  ]);

  const availableShops = shops.filter((shop) => !shop.is_blocked);

  return { tags, shops: availableShops, selectedTagIds };
}

export default function Home() {
  const { tags, shops, selectedTagIds } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const toggleTag = (tagId: string) => {
    const newParams = new URLSearchParams(searchParams);
    const currentTags = newParams.getAll("tags");

    if (currentTags.includes(tagId)) {
      newParams.delete("tags");
      currentTags
        .filter((id) => id !== tagId)
        .forEach((id) => newParams.append("tags", id));
    } else {
      newParams.append("tags", tagId);
    }

    setSearchParams(newParams);
  };

  const spinRoulette = () => {
    if (shops.length === 0) return;

    setIsSpinning(true);
    setSelectedShop(null);

    // アニメーション効果
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * shops.length);
      setSelectedShop(shops[randomIndex].name);
      setIsSpinning(false);
    }, 1500);
  };

  const tagColors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-red-100 text-red-800 border-red-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 Lunch Roulette
          </h1>
          <p className="text-gray-600">今日のランチを決めよう！</p>
        </header>

        {/* タグフィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            タグで絞り込み
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    isSelected
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : tagColors[index % tagColors.length]
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
          {selectedTagIds.length > 0 && (
            <button
              onClick={() => setSearchParams({})}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700"
            >
              フィルターをクリア
            </button>
          )}
        </div>

        {/* ルーレット */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <div
              className={`w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center border-4 border-orange-300 mb-4 transition-transform duration-1000 ${isSpinning ? "animate-spin" : ""}`}
            >
              {selectedShop ? (
                <div className="text-center px-4">
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="text-sm font-bold text-gray-800">
                    {selectedShop}
                  </div>
                </div>
              ) : (
                <span className="text-4xl">🍽️</span>
              )}
            </div>
            <button
              onClick={spinRoulette}
              disabled={shops.length === 0 || isSpinning}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isSpinning ? "ルーレット回転中..." : "ルーレットを回す"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              対象: {shops.length}件のお店
            </p>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-4">
          <Link
            to="/shops"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">🏪</div>
            <div className="text-sm font-medium text-gray-700">お店管理</div>
          </Link>
          <Link
            to="/settings"
            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium text-gray-700">設定</div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
