'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageGallery({ images }: { images: string[] }) {
  const [imageIndex, setImageIndex] = useState(-1);
  const slides = images.map(src => ({ src }));

  return (
    <Carousel>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className="relative md:basis-1/2 lg:basis-1/3"
            onClick={() => setImageIndex(index)}
          >
            <div className="h-100 relative">
              <Image src={image} alt={`tasting-note-${index}`} fill className="object-cover" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <Lightbox
        slides={slides}
        index={imageIndex}
        open={imageIndex >= 0}
        close={() => setImageIndex(-1)}
        styles={{
          root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, .8)' },
        }}
      />
      {images.length > 3 && (
        <>
          <CarouselPrevious className="-left-10" />
          <CarouselNext className="-right-10" />
        </>
      )}
    </Carousel>
  );
}
