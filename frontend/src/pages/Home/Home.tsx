import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { FloatingActionButton } from "@/components/FloatingActionButton/FloatingActionButton";
import { ReviewPostForm } from "@/components/ReviewPostForm/ReviewPostForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

      <FloatingActionButton onClick={() => setIsSheetOpen(true)} />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen} modal={false}>
        <SheetContent
          side="bottom"
          className="h-[90vh] overflow-y-auto data-[state=open]:duration-200 data-[state=closed]:duration-150"
          forceMount
        >
          <SheetHeader>
            <SheetTitle>レビューを投稿</SheetTitle>
          </SheetHeader>
          <div className="mt-4 max-w-md mx-auto w-full">
            <ReviewPostForm
              onSubmit={handleSubmitReview}
              onCancel={() => setIsSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
