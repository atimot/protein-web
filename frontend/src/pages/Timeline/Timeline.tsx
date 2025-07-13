import { Header } from "@/components/layout/Header";
import { ReviewFeed } from "@/components/ReviewFeed";

export const Timeline: React.FC = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            プロテインレビュー
          </h1>
          <ReviewFeed />
        </div>
      </main>
    </>
  );
}; 
