import { Review } from "@/types/review";

export const sampleReviews: Review[] = [
  {
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
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "フィットネス女子",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "週3トレーニング",
    },
    postedAt: "2023-05-14T18:45:00",
    images: ["/protein_sample.jpg", "/protein_sample.jpg"],
    productName: "ビーレジェンド ホエイプロテイン",
    flavorProfile: "フルーツ系（ストロベリー）",
    foamLevel: "やや高め（★★★☆☆）",
    proteinPerServing: "20g",
    pricePerServing: "¥160",
    comment:
      "ストロベリー味が自然で美味しいです！牛乳で割ると本当にストロベリーミルクのような味わいになります。泡立ちはやや多めですが、10分ほど置けば落ち着きます。タンパク質量はやや少なめですが、女性には十分な量だと思います。",
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "プロテインマニア",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "プロテインコレクター",
    },
    postedAt: "2023-05-13T12:15:00",
    images: [
      "/protein_sample.jpg",
      "/protein_sample.jpg",
      "/protein_sample.jpg",
    ],
    productName: "ゴールドスタンダード 100% ホエイ",
    flavorProfile: "スイーツ系（ダブルリッチチョコレート）",
    foamLevel: "非常に低い（★☆☆☆☆）",
    proteinPerServing: "24g",
    pricePerServing: "¥200",
    comment:
      "世界中で愛されているプロテインの定番です。溶けやすさは素晴らしく、シェイカーで10秒振るだけでほぼ完全に溶けます。泡立ちもほとんどなく、すぐに飲めるのが良いです。味も濃すぎず薄すぎず絶妙なバランス。少し値段は高めですが、品質を考えると納得できる価格です。",
  },
];