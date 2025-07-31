import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Review } from "@/types/review";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProteinReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ProteinReviewCardProps> = ({ review }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const postedDate = new Date(review.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, {
    addSuffix: true,
    locale: ja,
  });

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? review.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === review.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Card className="overflow-hidden rounded-none md:rounded-none">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src={review.user.avatar || ""}
              alt={review.user.name}
            />
            <AvatarFallback>{review.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{review.user.name}</div>
            <div className="text-xs text-muted-foreground">
              {review.user.level}
            </div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{timeAgo}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">{review.productName}</h2>
          
          {/* 詳細情報グリッド */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-none p-3 mb-3">
            <div className="grid grid-cols-1 gap-3">
              {/* 味の傾向 */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">味の傾向</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{review.flavorProfile}</span>
              </div>
              
              {/* 泡立ち */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">泡立ち</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{review.foamLevel}</span>
              </div>
              
              {/* タンパク質量と価格 */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">タンパク質量</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{review.proteinPerServing}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">1回あたり</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{review.pricePerServing}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 画像ギャラリー */}
        {review.images.length > 0 && (
          <div className="relative mb-4">
            <div className="relative aspect-square">
              <img
                src={review.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${review.productName} 画像 ${currentImageIndex + 1}`}
                className="rounded-none object-cover w-full h-full"
                loading="lazy"
              />
              
              {/* ナビゲーションボタン */}
              {review.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={handlePreviousImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            
            {/* インジケーター */}
            {review.images.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {review.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-gray-800 dark:bg-gray-200"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`画像 ${index + 1} を表示`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* コメント */}
        <div className="text-sm">
          <p>{review.comment}</p>
        </div>
      </CardContent>
    </Card>
  );
};
