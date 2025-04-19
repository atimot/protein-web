"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  maxImages: number
  onImagesChange: (files: File[]) => void
}

export function ImageUpload({ maxImages, onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const validFiles = newFiles.slice(0, maxImages - images.length)

      // 画像プレビューを生成
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...validFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
      onImagesChange([...images, ...validFiles])

      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    // プレビューURLを解放
    URL.revokeObjectURL(previews[index])

    const newImages = [...images]
    const newPreviews = [...previews]

    newImages.splice(index, 1)
    newPreviews.splice(index, 1)

    setImages(newImages)
    setPreviews(newPreviews)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={preview || "/placeholder.svg"}
                alt={`プレビュー ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-16 border-dashed"
          >
            <ImagePlus className="mr-2 h-5 w-5" />
            画像を追加
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            {images.length}/{maxImages} 枚（クリックして追加）
          </p>
        </div>
      )}
    </div>
  )
}
