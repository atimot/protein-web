import type React from "react";

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ImageUpload/ImageUpload"
import type { ReviewFormData } from "@/types/review"

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void
  isSubmitting: boolean
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    productName: "",
    flavorProfile: "",
    flavorType: "",
    foamLevel: "",
    proteinPerServing: "",
    pricePerServing: "",
    comment: "",
    images: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  const handleImagesChange = (files: File[]) => {
    setFormData((prev) => ({ ...prev, images: files }));
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "商品名は必須です";
    }

    if (!formData.flavorType) {
      newErrors.flavorType = "フレーバータイプは必須です";
    }

    if (!formData.flavorProfile.trim()) {
      newErrors.flavorProfile = "味の詳細を入力してください";
    }

    if (!formData.foamLevel) {
      newErrors.foamLevel = "泡立ちを選択してください";
    }
    
    if (!formData.proteinPerServing.trim()) {
      newErrors.proteinPerServing = "タンパク質量を入力してください";
    }

    if (!formData.pricePerServing.trim()) {
      newErrors.pricePerServing = "価格を入力してください";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "コメントを入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const flavorProfileWithType = `${formData.flavorType} ${formData.flavorProfile}`;
      const submitData = {
        ...formData,
        flavorProfile: flavorProfileWithType,
      }

      onSubmit(submitData);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">商品名 *</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="例: マイプロテイン Impact ホエイ"
                className={errors.productName ? "border-red-500" : ""}
              />
              {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="flavorType">味の傾向 *</Label>
                <Select value={formData.flavorType} onValueChange={(value) => handleSelectChange("flavorType", value)}>
                  <SelectTrigger id="flavorType" className={errors.flavorType ? "border-red-500" : ""}>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="スイーツ系">スイーツ系</SelectItem>
                    <SelectItem value="フルーツ系">フルーツ系</SelectItem>
                    <SelectItem value="ドリンク系">ドリンク系</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
                {errors.flavorType && <p className="text-red-500 text-xs mt-1">{errors.flavorType}</p>}
              </div>

              <div>
                <Label htmlFor="flavorProfile">味の詳細 *</Label>
                <Input
                  id="flavorProfile"
                  name="flavorProfile"
                  value={formData.flavorProfile}
                  onChange={handleChange}
                  placeholder="例: チョコレート"
                  className={errors.flavorProfile ? "border-red-500" : ""}
                />
                {errors.flavorProfile && <p className="text-red-500 text-xs mt-1">{errors.flavorProfile}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="foamLevel">泡立ち *</Label>
                <Select value={formData.foamLevel} onValueChange={(value) => handleSelectChange("foamLevel", value)}>
                  <SelectTrigger id="foamLevel" className={errors.foamLevel ? "border-red-500" : ""}>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="非常に低い（★☆☆☆☆）">非常に低い</SelectItem>
                    <SelectItem value="低め（★★☆☆☆）">低め</SelectItem>
                    <SelectItem value="普通（★★★☆☆）">普通</SelectItem>
                    <SelectItem value="やや高め（★★★★☆）">やや高め</SelectItem>
                    <SelectItem value="高い（★★★★★）">高い</SelectItem>
                  </SelectContent>
                </Select>
                {errors.foamLevel && <p className="text-red-500 text-xs mt-1">{errors.foamLevel}</p>}
              </div>

              <div>
                <Label htmlFor="proteinPerServing">タンパク質量 *</Label>
                <Input
                  id="proteinPerServing"
                  name="proteinPerServing"
                  value={formData.proteinPerServing}
                  onChange={handleChange}
                  placeholder="例: 24g"
                  className={errors.proteinPerServing ? "border-red-500" : ""}
                />
                {errors.proteinPerServing && <p className="text-red-500 text-xs mt-1">{errors.proteinPerServing}</p>}
              </div>

              <div>
                <Label htmlFor="pricePerServing">1回あたりの価格 *</Label>
                <Input
                  id="pricePerServing"
                  name="pricePerServing"
                  value={formData.pricePerServing}
                  onChange={handleChange}
                  placeholder="例: ¥180"
                  className={errors.pricePerServing ? "border-red-500" : ""}
                />
                {errors.pricePerServing && <p className="text-red-500 text-xs mt-1">{errors.pricePerServing}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">レビューコメント *</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="味、溶けやすさ、コスパなどについて詳しく教えてください"
                className={`min-h-[120px] ${errors.comment ? "border-red-500" : ""}`}
              />
              {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
            </div>

            <div>
              <Label>画像（最大4枚）</Label>
              <ImageUpload maxImages={4} onImagesChange={handleImagesChange} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "投稿中..." : "レビューを投稿する"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}