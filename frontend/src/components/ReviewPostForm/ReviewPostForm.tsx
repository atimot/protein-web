import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { ReviewFormData } from "@/types/review";

interface ReviewPostFormProps {
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
}

export const ReviewPostForm: React.FC<ReviewPostFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    productName: "",
    flavorProfile: "",
    flavorType: "",
    foamLevel: "",
    proteinPerServing: "",
    pricePerServing: "",
    comment: "",
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files].slice(0, 4); // 最大4枚まで
    
    setFormData((prev) => ({ ...prev, images: newImages }));
    
    // プレビュー用のURLを生成
    const newPreviewUrls = newImages.map((file) => URL.createObjectURL(file));
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls(newPreviewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="productName">商品名</Label>
        <Input
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="プロテイン商品名"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flavorProfile">フレーバー</Label>
          <Input
            id="flavorProfile"
            name="flavorProfile"
            value={formData.flavorProfile}
            onChange={handleInputChange}
            placeholder="チョコレート"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="flavorType">フレーバータイプ</Label>
          <Select
            value={formData.flavorType}
            onValueChange={(value) => handleSelectChange("flavorType", value)}
          >
            <SelectTrigger id="flavorType">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sweet">甘い系</SelectItem>
              <SelectItem value="refreshing">さっぱり系</SelectItem>
              <SelectItem value="milky">ミルキー系</SelectItem>
              <SelectItem value="fruity">フルーティー系</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proteinPerServing">タンパク質量（1回分）</Label>
          <Input
            id="proteinPerServing"
            name="proteinPerServing"
            value={formData.proteinPerServing}
            onChange={handleInputChange}
            placeholder="20g"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerServing">価格（1回分）</Label>
          <Input
            id="pricePerServing"
            name="pricePerServing"
            value={formData.pricePerServing}
            onChange={handleInputChange}
            placeholder="¥150"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="foamLevel">泡立ち</Label>
        <Select
          value={formData.foamLevel}
          onValueChange={(value) => handleSelectChange("foamLevel", value)}
        >
          <SelectTrigger id="foamLevel">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">なし</SelectItem>
            <SelectItem value="low">少ない</SelectItem>
            <SelectItem value="medium">普通</SelectItem>
            <SelectItem value="high">多い</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">レビューコメント</Label>
        <Textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          placeholder="味や飲みやすさなど、感想をお書きください"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>画像（最大4枚）</Label>
        <div className="grid grid-cols-2 gap-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`プレビュー ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.images.length < 4 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">画像を追加</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1 touch-manipulation">
          投稿する
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="touch-manipulation">
          キャンセル
        </Button>
      </div>
    </form>
  );
};