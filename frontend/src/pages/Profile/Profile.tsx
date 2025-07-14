import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiSettings, FiUser, FiTrendingUp, FiStar, FiTarget } from "react-icons/fi";
import { cn } from "@/lib/utils";

export const Profile: React.FC = () => {
  const containerClasses = cn(
    "min-h-screen bg-gray-50",
    "dark:bg-gray-900"
  );

  const mainClasses = cn(
    "container max-w-2xl mx-auto px-4 py-6 space-y-6"
  );

  const profileHeaderClasses = cn(
    "bg-white rounded-xl border shadow-sm p-6",
    "dark:bg-gray-800 dark:border-gray-700"
  );

  const avatarContainerClasses = cn(
    "flex flex-col sm:flex-row items-center gap-4 mb-6"
  );

  const userInfoClasses = cn(
    "text-center sm:text-left flex-1"
  );

  const statsGridClasses = cn(
    "grid grid-cols-1 md:grid-cols-2 gap-4"
  );

  return (
    <div className={containerClasses}>
      <Header />
      
      <main className={mainClasses}>
        {/* プロフィールヘッダー */}
        <div className={profileHeaderClasses}>
          <div className={avatarContainerClasses}>
            <Avatar className="w-20 h-20 md:w-24 md:h-24">
              <AvatarImage src="/api/placeholder/150/150" alt="プロフィール画像" />
              <AvatarFallback className="text-xl">
                <FiUser />
              </AvatarFallback>
            </Avatar>
            
            <div className={userInfoClasses}>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                山田太郎
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                プロテイン愛好家 | トレーニング歴3年
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <FiEdit2 />
                  プロフィール編集
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <FiSettings />
                  設定
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className={statsGridClasses}>
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiUser className="text-amber-600" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">年齢</span>
                <span className="font-medium">28歳</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">性別</span>
                <span className="font-medium">男性</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">身長</span>
                <span className="font-medium">175cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">体重</span>
                <span className="font-medium">70kg</span>
              </div>
            </CardContent>
          </Card>

          {/* プロテイン統計 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiTrendingUp className="text-amber-600" />
                プロテイン統計
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">試したブランド数</span>
                <span className="font-medium">12ブランド</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">投稿レビュー数</span>
                <span className="font-medium">8件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">お気に入り</span>
                <span className="font-medium">3種類</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">平均評価</span>
                <span className="font-medium flex items-center gap-1">
                  <FiStar className="text-yellow-500" />
                  4.2
                </span>
              </div>
            </CardContent>
          </Card>

          {/* トレーニング目標 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiTarget className="text-amber-600" />
                トレーニング目標
              </CardTitle>
              <CardDescription>
                現在の目標設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    筋肉量増加
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    目標: +5kg (残り3kg)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* アクティビティ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiStar className="text-amber-600" />
                最近のアクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    「ザバス ホエイプロテイン」をレビューしました
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    新しいプロテインを試しました
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    目標体重を更新しました
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}; 
