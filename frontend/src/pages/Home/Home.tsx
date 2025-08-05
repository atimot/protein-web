import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewPostForm } from "@/components/ReviewPostForm/ReviewPostForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { sampleReviews } from "@/data/sampleReviews";
import { ReviewFormData } from "@/types/review";

export const Home: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmitReview = (data: ReviewFormData) => {
    console.log("Review submitted:", data);
    // TODO: APIに送信する処理を実装
    setIsSheetOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-gray-50">
        <div className="container md:max-w-md mx-auto">
          <div>
            {sampleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full z-50 touch-manipulation"
          >
            <Plus />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] gap-0 flex flex-col p-0">
          <SheetHeader className="px-4">
            <SheetTitle>レビューを投稿</SheetTitle>
          </SheetHeader>
          <div className="flex-1 px-4 relative">
            <ReviewPostForm
              onSubmit={handleSubmitReview}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
