import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Modal } from '../Modal'
import { cn } from '@/lib/utils'
import fallbackSrc from '@/assets/icons/placeholder.svg'
import { Eye } from 'lucide-react'
import { ImgHTMLAttributes, forwardRef, useEffect, useState } from 'react'

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  customFallbackSrc?: string
}

const ImageWithPreview = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, customFallbackSrc, className = '', alt = 'image', ...rest }, ref) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [modalImgSrc, setModalImgSrc] = useState<string | undefined>(
      typeof src === 'string' ? src : undefined,
    )
    const [modalIsFallback, setModalIsFallback] = useState(false)

    useEffect(() => {
      setModalImgSrc(typeof src === 'string' ? src : undefined)
      setModalIsFallback(false)
    }, [src])

    const handleModalError = () => {
      if (!modalIsFallback) {
        setModalImgSrc(customFallbackSrc || (fallbackSrc as unknown as string))
        setModalIsFallback(true)
      }
    }

    return (
      <div className={cn('relative group inline-block', className)}>
        <Avatar className="h-full w-full rounded-full">
          <AvatarImage
            ref={ref}
            src={typeof src === 'string' ? src : undefined}
            alt={alt}
            className={cn('aspect-auto object-cover h-full w-full', className)}
            {...(rest as any)}
          />
          <AvatarFallback className="rounded-full">
            <img
              src={customFallbackSrc || (fallbackSrc as unknown as string)}
              alt="fallback"
              className="h-full w-full object-contain"
            />
          </AvatarFallback>
        </Avatar>

        <div className="pointer-events-none absolute inset-0 rounded-full transition-all duration-100 group-hover:bg-black/50">
          <div className="flex h-full w-full items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="pointer-events-auto">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewOpen(true)
                }}
                className="size-8 p-0 hover:bg-transparent bg-transparent border-0 text-white"
                aria-label="Preview image"
                title="Preview"
              >
                <Eye className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {previewOpen && (
          <Modal
            isOpen={previewOpen}
            setIsOpen={() => setPreviewOpen(false)}
            contentClass="bg-transparent !w-[90vw] justify-center p-6 md:p-12 max-w-3xl border-none shadow-none!"
          >
            <img
              {...rest}
              src={modalImgSrc || undefined}
              alt={alt}
              className={`max-h-[80vh] w-auto ${modalIsFallback ? 'object-contain' : ''}`}
              onError={handleModalError}
            />
          </Modal>
        )}
      </div>
    )
  },
)

ImageWithPreview.displayName = 'ImageWithPreview'
export default ImageWithPreview