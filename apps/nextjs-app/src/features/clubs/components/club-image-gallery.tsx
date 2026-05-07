"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ClubImageGalleryProps {
  images: string[];
  clubName: string;
}

export function ClubImageGallery({ images, clubName }: ClubImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="w-full flex justify-center">
        {/* w-3/4 exactly matches the basis-3/4 size from the CarouselItem */}
        <div className="w-3/4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/50">
            <Image
              src={images[0]}
              alt={`${clubName} gallery image 1`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {images.map((url, index) => (
          <CarouselItem key={index} className="pl-1 basis-3/4">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/50">
              <Image
                src={url}
                alt={`${clubName} gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Position arrows inside the container but over the images to work nicely edge-to-edge */}
      <CarouselPrevious
        className="hidden md:flex md:left-16 md:w-16 md:h-16 bg-background/80 border-none shadow-md hover:bg-background md:[&_svg]:w-8 md:[&_svg]:h-8"
      />
      <CarouselNext
        className="hidden md:flex md:right-16 md:w-16 md:h-16 bg-background/80 border-none shadow-md hover:bg-background md:[&_svg]:w-8 md:[&_svg]:h-8"
      />
    </Carousel>
  );
}
