import { Meta, StoryObj } from "@storybook/react";

import { ReviewCard } from "./ReviewCard";
import { Review } from "@/types/review";

const meta: Meta<typeof ReviewCard> = {
  title: "ReviewCard",
  component: ReviewCard,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[500px] mx-auto">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const review: Review = {
  id: 1,
  user: {
    id: 1,
    name: "筋トレマン",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "プロテイン上級者",
  },
  postedAt: "2023-05-15T09:30:00",
  images: [
    "/protein_sample.jpg",
    "/protein_sample.jpg",
    "/protein_sample.jpg",
    "/protein_sample.jpg",
  ],
  productName: "マッスルテック ナイトロテック ホエイゴールド",
  flavorProfile: "スイーツ系（チョコレートブラウニー）",
  foamLevel: "低め（★★☆☆☆）",
  proteinPerServing: "24g",
  pricePerServing: "¥180",
  comment:
    "溶けやすさは抜群で、水でも美味しく飲めます。チョコレートの風味が強すぎず、飲みやすいです。トレーニング後にすぐ飲んでも胃もたれしません。コスパも良く、継続して飲みやすいプロテインだと思います。",
};

export const Default: Story = {
  args: {
    review,
  },
};
