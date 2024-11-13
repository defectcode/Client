import Link from 'next/link';
import { useState } from 'react';
import { PUBLIC_URL } from '@/config/url.config';
import { IProduct } from '@/shared/types/product.interface';
import { formatPrice } from '@/utils/string/format-price';
import { AddToCartButton } from './AddToCartButton';
import { FavoriteButton } from './FavoriteButton';
import Image from 'next/image';
import { CheckoutForProduct } from '@/components/layouts/main-layout/header/header-menu/header-cart/CheckoutForProduct';

interface ProductInfoProps {
  product: IProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [isCheckoutCartVisible, setIsCheckoutCartVisible] = useState(false);

  const handleAddToCart = () => {
    setIsCheckoutCartVisible(true); // Arată CheckoutCartHeader
    setTimeout(() => setIsCheckoutCartVisible(false), 5000); // Ascunde după 7 secunde
  };

  const rating =
    Math.round(
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
    ) || 0;

  return (
    <div className="mt-10 sm:mt-16 lg:mt-0 md:w-[393px] w-full">
      <div className='flex items-center gap-5 mb-5'>
        <h1 className="font-Heebo-24 text-black bg-clip-tex">
          {product.title}
        </h1>
		<div className="flex items-center justify-center font-Heebo-reg-13 text-[#5D5D5D] md:hidden">{formatPrice(product.price)}</div>	
        <div className='md:block hidden'>
			<FavoriteButton product={product} />
		</div>
      </div>
      <div className="flex items-center mb-5">
        <Link className="font-Heebo-reg-16 text-[#8C8C8C]" href={PUBLIC_URL.category(product.category.id)}>
          {product.category.title}
        </Link>
      </div>
      <div className='flex gap-[10px] md:mb-5'>
        <div className="flex items-center justify-center font-Heebo-reg-13 text-[#5D5D5D] md:block hidden">{formatPrice(product.price)}</div>	
        <span className="flex items-center gap-x-4 border bg-[#A1A1A1]/10 rounded-xl md:block hidden"></span>
        <span className="font-Heebo-reg-14 md:block hidden">{product.color.name}</span>
      </div>
      <div className="flex items-center gap-x-4 mb-5">
		<div className="flex items-center justify-between w-full gap-x-2 md:flex-row">
			<div
			className="w-6 h-6 rounded-full border border-gray-600"
			style={{ backgroundColor: product.color.value }}
			/>
				<span className="font-Heebo-reg-14 md:hidden">{product.color.name}</span>
			</div>
	</div>

      <h1 className='text-[#5D5D5D] font-Heebo-reg-16 mb-5'>Description</h1>
      <p className="font-Heebo-15-light text-[#8C8C8C] max-w-[393px] w-full mb-10">{product.description}</p>
      <div className="flex flex-col md:flex-row items-start gap-x-2 w-full">
        <div className="w-full space-y-[10px]">
          <AddToCartButton product={product} onAddToCart={handleAddToCart} />
          <button className="w-full mb-2 bg-[#1E1E1E] flex items-center justify-center h-[48px] rounded-[10px]">
            <Image src='/images/applepayBlack.svg' alt='applepay' width={42} height={16} className='' />
          </button>
        </div>
      </div>
      {isCheckoutCartVisible && <CheckoutForProduct />} {/* Afișează CheckoutForProduct dacă isCheckoutCartVisible este true */}
    </div>
  );
}
