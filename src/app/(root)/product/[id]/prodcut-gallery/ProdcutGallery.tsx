import Image from 'next/image';
import { useState } from 'react';
import { IProduct } from '@/shared/types/product.interface';
import { cn } from '@/utils/clsx';

import './ProductGallery.css'

interface ProductGalleryProps {
  product: IProduct;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Funcția pentru a naviga la imaginea anterioară
  const handlePrevImage = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.images.length - 1));
  };

  // Funcția pentru a naviga la imaginea următoare
  const handleNextImage = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex < product.images.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4">
      <div
  className="hidden lg:flex lg:flex-col gap-3 overflow-y-auto no-scrollbar custom-scrollbar"
  style={{
    maxHeight: "758px", // limitează înălțimea containerului
  }}
>
  {product.images.map((image: string, index: number) => (
    <button
      key={index}
      onClick={() => setCurrentIndex(index)}
      className={cn(
        "duration-300 border rounded-lg overflow-hidden",
        index === currentIndex ? 'border-black' : 'border-transparent'
      )}
      style={{
        width: "104px",
        height: "104px",
        flexShrink: 0, // împiedică butoanele să-și modifice dimensiunile
      }}
    >
      <Image src={image} alt={product.title} layout="fixed" width={104} height={104} />
    </button>
  ))}
</div>


      {/* Imaginea principală */}
      <div className="relative">
        <Image
          src={product.images[currentIndex]}
          alt={product.title}
          width={758}
          height={758}
          className="rounded-lg lg:h-[758px] lg:w-[758px] h-auto w-full"
        />

        {/* Butoanele de navigare pentru desktop (în colțul din dreapta jos) */}
        <div className="hidden lg:flex absolute bottom-4 right-4 space-x-[10px] mr-5 mb-5">
          <button
            onClick={handlePrevImage}
            className="bg-[#A1A1A1]/10 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center"
          >
            <Image src='/images/leftArrow.svg' alt='arrow' width={9} height={12}/>
          </button>
          <button
            onClick={handleNextImage}
            className="bg-[#A1A1A1]/10 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center"
          >
            <Image src='/images/rightArrow.svg' alt='arrow' width={9} height={12}/>
          </button>
        </div>
      </div>

      {/* Miniaturile sub imagine (pentru mobil) */}
      <div className="flex lg:hidden mt-6 gap-4 overflow-x-auto">
        {product.images.map((image: string, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "duration-300 border rounded-lg overflow-hidden w-16 h-16",
              index === currentIndex ? 'border-black' : 'border-transparent'
            )}
          >
            <Image src={image} alt={product.title} width={80} height={80} />
          </button>
        ))}
      </div>
    </div>
  );
}
