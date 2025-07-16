import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FiSearch, 
  FiTrendingUp, 
  FiStar, 
  FiFilter,
  FiHeart,
  FiUser,
  FiZap
} from "react-icons/fi";

export const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const trendingItems = [
    { name: "ザバス ホエイプロテイン", rating: 4.5, reviews: 128 },
    { name: "DNS プロテインG+", rating: 4.3, reviews: 95 },
    { name: "ビーレジェンド", rating: 4.7, reviews: 210 },
    { name: "マイプロテイン", rating: 4.2, reviews: 87 }
  ];

  const recommendedItems = [
    { name: "オプティマム ゴールドスタンダード", reason: "高評価ユーザーが愛用", rating: 4.6 },
    { name: "アルプロン WPI", reason: "コスパ最強", rating: 4.4 },
    { name: "ハレオ C3Xハイパー", reason: "筋力アップ重視", rating: 4.8 }
  ];

  const categories = [
    { name: "ホエイプロテイン", count: 45, icon: "🥛" },
    { name: "カゼインプロテイン", count: 23, icon: "🍼" },
    { name: "ソイプロテイン", count: 31, icon: "🌱" },
    { name: "WPIプロテイン", count: 18, icon: "⚡" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 検索セクション */}
        <div className="bg-white rounded-xl border shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            プロテインを発見しよう
          </h1>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="プロテインやブランドを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <FiFilter />
              フィルター
            </Button>
            <Button variant="ghost" size="sm">価格帯</Button>
            <Button variant="ghost" size="sm">評価</Button>
            <Button variant="ghost" size="sm">ブランド</Button>
          </div>
        </div>

        {/* カテゴリー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiZap className="text-amber-600" />
              カテゴリー別に探す
            </CardTitle>
            <CardDescription>
              タイプ別にプロテインを探してみましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count}商品</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* トレンドセクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiTrendingUp className="text-amber-600" />
              今話題のプロテイン
            </CardTitle>
            <CardDescription>
              多くのユーザーがレビューしている人気商品
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingItems.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                    <FiHeart className="text-gray-400 w-4 h-4 hover:text-red-500 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 w-4 h-4" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({item.reviews}件)</span>
                  </div>
                  <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
                    🔥 トレンド
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* おすすめセクション */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiUser className="text-amber-600" />
              あなたへのおすすめ
            </CardTitle>
            <CardDescription>
              プロフィール情報とレビュー履歴に基づくおすすめ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{item.reason}</p>
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-500 w-4 h-4" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近の人気レビュー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiStar className="text-amber-600" />
              最近の人気レビュー
            </CardTitle>
            <CardDescription>
              コミュニティで注目されているレビュー
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">田中健太</p>
                    <p className="text-xs text-gray-500">2時間前</p>
                  </div>
                </div>
                <p className="text-sm mb-2">
                  「ザバス ホエイプロテイン」のチョコレート味を試してみました。溶けやすく、味も申し分なし！コスパも良いです。
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiStar className="w-3 h-3" />
                    4.5
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart className="w-3 h-3" />
                    24
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">佐藤美咲</p>
                    <p className="text-xs text-gray-500">5時間前</p>
                  </div>
                </div>
                <p className="text-sm mb-2">
                  マイプロテインのストロベリークリーム味、想像以上に美味しかった！女性にもおすすめです。
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiStar className="w-3 h-3" />
                    4.8
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart className="w-3 h-3" />
                    18
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}; 
