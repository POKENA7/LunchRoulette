import { Link } from "react-router";

export default function Settings() {
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
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  近場
                </span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  軽め
                </span>
                <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                  がっつり
                </span>
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                  雨でも行ける
                </span>
              </div>
              <button className="text-sm text-orange-600 hover:text-orange-700">
                + タグを追加
              </button>
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
