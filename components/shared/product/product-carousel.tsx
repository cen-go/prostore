"use client"

import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious  } from "@/components/ui/carousel"
import { Product } from "@/types"
import Link from "next/link";
import Image from "next/image";

export default function ProductCarousel({products}: {products: Product[]}) {
 
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 6000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {products.map((p) => (
          <CarouselItem key={p.id}>
            <Link href={`/products/${p.slug}`}>
              <div className="relative mx-auto w-full h-40 sm:h-50 md:h-70 lg:h-100">
                <Image
                  src={p.banner!}
                  alt={`${p.name} banner`}
                  fill
                  sizes="100vw"
                  className="w-full h-auto object-contain"
                />
                <div className='absolute inset-0 flex items-end justify-center'>
                  <h2 className='bg-gray-900/50 bg-opacity-50 text-2xl font-bold px-2 text-white'>
                    {p.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="default" className="bg-black" />
      <CarouselNext variant="default" className="bg-black" />
    </Carousel>
  );
}