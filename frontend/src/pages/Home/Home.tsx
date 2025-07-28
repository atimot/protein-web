import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import { sampleReviews } from "@/data/sampleReviews";

export const Home: React.FC = () => {
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
    </div>
  );
}; 
