import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { Review } from "@/types/review";

interface ProteinReviewCardProps {
  review: Review;
}

export const ProteinReviewCard: React.FC<ProteinReviewCardProps> = ({
  review,
}) => {
  const postedDate = new Date(review.postedAt);
  const timeAgo = formatDistanceToNow(postedDate, {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Card className="overflow-hidden">
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
          <h2 className="text-lg font-bold mb-1">{review.productName}</h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-sm">
              <span className="font-medium">味の傾向:</span>
              {review.flavorProfile}
            </div>
            <div className="text-sm">
              <span className="font-medium">泡立ち:</span> {review.foamLevel}
            </div>
            <div className="text-sm">
              <span className="font-medium">タンパク質量:</span>{" "}
              {review.proteinPerServing}
            </div>
            <div className="text-sm">
              <span className="font-medium">1回あたり:</span>{" "}
              {review.pricePerServing}
            </div>
          </div>
        </div>

        {/* 画像ギャラリー */}
        {review.images.length > 0 && (
          <div
            className={`grid gap-2 mb-4 ${review.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {review.images.map((image, index) => (
              <div
                key={index}
                className={`relative ${review.images.length > 2 && index >= 2 ? "col-span-1" : ""} ${review.images.length === 3 && index === 2 ? "col-span-2" : ""}`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${review.productName} 画像 ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full aspect-square"
                  loading="lazy"
                />
              </div>
            ))}
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
