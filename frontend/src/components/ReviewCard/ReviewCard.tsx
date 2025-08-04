import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
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
  const now = new Date();
  const hoursAgo = differenceInHours(now, postedDate);

  const displayDate =
    hoursAgo < 24
      ? formatDistanceToNow(postedDate, { addSuffix: true, locale: ja })
      : format(postedDate, "yyyy年MM月dd日", { locale: ja });

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? review.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === review.images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <Card className="overflow-hidden gap-2 py-4 border-none rounded-none">
      <CardHeader className="px-3 gap-0">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={review.user.avatar || ""}
              alt={review.user.name}
            />
            <AvatarFallback>{review.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{review.user.name}</div>
          <div className="ml-auto text-xs text-muted-foreground">
            {displayDate}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {/* 画像ギャラリー */}
        {review.images.length > 0 && (
          <div className="relative mb-4">
            <div className="relative aspect-square overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${review.productName} 画像 ${index + 1}`}
                    className="rounded-none object-cover w-full h-full flex-shrink-0"
                    loading="lazy"
                  />
                ))}
              </div>

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
          </div>
        )}

        {/* プロテイン情報 */}
        <div className="px-3 pb-2">
          <div className="flex gap-4 text-sm text-muted-foreground mb-2">
            <span>タンパク質: {review.proteinPerServing}</span>
            <span>価格: {review.pricePerServing}</span>
          </div>
          {/* コメント */}
          <div className="text-sm whitespace-pre-wrap">
            <p>{review.comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
