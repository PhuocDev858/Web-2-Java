import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Upload, X, Star, Loader2, AlertCircle } from 'lucide-react'
import { imageService } from '@/services/imageService'

interface UploadedImage {
  url: string
  isPrimary: boolean
  file?: File
}

interface ImageUploaderProps {
  onUpload?: (url: string) => void  // Callback khi upload xong
  maxImages?: number
  existingImages?: UploadedImage[]
}

export interface ImageUploaderHandle {
  getPendingFiles: () => UploadedImage[]
  uploadFiles: (productId: number | string) => Promise<string[]>
  clearFiles: () => void
}

export const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
  ({
    onUpload,
    maxImages = 5,
    existingImages = [],
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [images, setImages] = useState<UploadedImage[]>(existingImages)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')
    const [dragOver, setDragOver] = useState(false)

    // Expose methods for parent component
    useImperativeHandle(ref, () => ({
      getPendingFiles: () => images.filter(img => img.file),
      
      uploadFiles: async (productId: number | string) => {
        const pendingFiles = images.filter(img => img.file)
        if (pendingFiles.length === 0) return []

        setIsUploading(true)
        const uploadedUrls: string[] = []

        try {
          for (let i = 0; i < pendingFiles.length; i++) {
            const img = pendingFiles[i]
            const oldPreviewUrl = img.url

            const result = await imageService.uploadForProduct(
              productId,
              img.file!,
              img.isPrimary,
              i
            )

            uploadedUrls.push(result.url)

            // Thay preview URL bằng URL thực từ server
            setImages((prev) =>
              prev.map((image) =>
                image.url === oldPreviewUrl
                  ? { ...image, url: result.url, file: undefined }
                  : image
              )
            )

            onUpload?.(result.url)
          }
        } catch (err: any) {
          const msg = typeof err.response?.data === 'string'
            ? err.response.data
            : err.message || 'Upload thất bại'
          setError(msg)
          throw err
        } finally {
          setIsUploading(false)
        }

        return uploadedUrls
      },

      clearFiles: () => {
        images.forEach((img) => {
          if (img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
          }
        })
        setImages(existingImages)
      },
    }), [images, existingImages, onUpload])

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) return
      if (images.length + files.length > maxImages) {
        setError(`Chỉ được upload tối đa ${maxImages} ảnh`)
        return
      }

      setError('')

      try {
        const fileArray = Array.from(files)
        const newImages: UploadedImage[] = []

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i]
          const previewUrl = URL.createObjectURL(file)
          const isFirst = images.length + newImages.length === 0 && i === 0

          newImages.push({
            url: previewUrl,
            isPrimary: isFirst,
            file,
          })
        }

        setImages((prev) => [...prev, ...newImages])
      } catch (err: any) {
        setError('Lỗi khi xử lý ảnh')
      }
    }

  const handleRemove = (index: number) => {
    setImages((prev) => {
      const img = prev[index]
      if (img.url.startsWith('blob:')) {
        URL.revokeObjectURL(img.url)
      }
      const next = prev.filter((_, i) => i !== index)
      // Nếu xoá ảnh chính và còn ảnh khác → set ảnh đầu tiên làm chính
      if (prev[index].isPrimary && next.length > 0) {
        next[0].isPrimary = true
      }
      return next
    })
  }

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    )
  }

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        } ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isUploading ? (
          <div className="flex items-center justify-center gap-2 text-primary-600">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Đang upload...</span>
          </div>
        ) : (
          <>
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">
              Kéo thả hoặc <span className="text-primary-600">click để chọn ảnh</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WEBP, GIF · Tối đa 10MB/ảnh · {images.length}/{maxImages} ảnh
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group aspect-square">
              <img
                src={img.url}
                alt={`Ảnh ${idx + 1}`}
                className={`w-full h-full object-cover rounded-lg border-2 transition-colors ${
                  img.isPrimary ? 'border-primary-500' : 'border-gray-200'
                }`}
              />

              {/* Badge ảnh chính */}
              {img.isPrimary && (
                <span className="absolute top-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                  <Star size={10} fill="white" /> Chính
                </span>
              )}

              {/* Badge chờ upload */}
              {img.file && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                  <AlertCircle size={10} /> Chờ upload
                </span>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Đặt làm ảnh chính"
                    className="bg-yellow-400 text-white p-1.5 rounded-full hover:bg-yellow-500"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Xoá ảnh"
                  className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
)