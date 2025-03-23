"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductImages({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  function handleClick(index: number) {
    setCurrent(index);
  }

  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt={`product image ${current + 1}`}
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-3">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => handleClick(index)}
            className={cn(
              "cursor-pointer border",
              current === index && "border-2 border-orange-300"
            )}
          >
            <Image src={image} alt="thumb image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
}
