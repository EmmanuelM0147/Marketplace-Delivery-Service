"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: Array<{
    url: string;
    alt_text: string;
    is_primary: boolean;
  }>;
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.is_primary) || images[0]
  );

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <Image
          src={selectedImage.url}
          alt={selectedImage.alt_text}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={cn(
              "aspect-square relative rounded-md overflow-hidden",
              selectedImage.url === image.url && "ring-2 ring-primary"
            )}
          >
            <Image
              src={image.url}
              alt={image.alt_text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 12vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}