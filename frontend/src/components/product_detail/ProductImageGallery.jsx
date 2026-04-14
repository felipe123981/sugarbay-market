
    import React from 'react';
    import { Button } from "@/components/ui/button";
    import { ChevronLeft, ChevronRight } from 'lucide-react';
    import { motion } from 'framer-motion';

    const ProductImageGallery = ({
      productName,
      selectedImage,
      galleryImages,
      currentImageIndex,
      onThumbnailClick,
      onNavigateImage
    }) => {
      if (!galleryImages || galleryImages.length === 0) {
        return (
          <div className="w-full h-auto max-h-[500px] flex items-center justify-center bg-muted rounded-lg border shadow-lg mb-4 aspect-square">
            <img alt={productName || "Product image"} className="w-full h-full object-contain p-8" src="/placeholder.svg" />
          </div>
        );
      }

      return (
        <div className="sticky top-24">
          <div className="relative">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg border shadow-lg mb-4 aspect-square overflow-hidden"
            >
              <img
                src={selectedImage || '/placeholder.svg'}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {galleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigateImage(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigateImage(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto mt-2 pb-2">
              {galleryImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 shrink-0 ${
                    index === currentImageIndex
                      ? 'border-primary shadow-md'
                      : 'border-transparent hover:border-muted'
                  }`}
                  onClick={() => onThumbnailClick(imageUrl, index)}
                >
                  <img
                    src={imageUrl}
                    alt={`${productName} - view ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default ProductImageGallery;
  