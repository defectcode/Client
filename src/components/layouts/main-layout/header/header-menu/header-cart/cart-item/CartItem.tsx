import Image from 'next/image';
import Link from 'next/link';

import { PUBLIC_URL } from '@/config/url.config';
import { ICartItem } from '@/shared/types/cart.interface';
import { formatPrice } from '@/utils/string/format-price';
import { CartActions } from './CartActions';
import { useDispatch } from 'react-redux';
import { cartSlice } from '@/store/cart/cart.slice';
import { FavoriteButton } from '@/app/(root)/product/[id]/product-info/FavoriteButton';

interface CartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(cartSlice.actions.removeFromCart({ id: item.id }));
  };

  return (
    <div className="relative flex items-center mb-5">
      <button
        onClick={handleRemoveItem}
        className="absolute top-0 right-0 bg-transparent text-gray-600 hover:text-red-600 p-1 rounded-full focus:outline-none"
        aria-label="Remove item"
      >
        &times;
      </button>
      <Link
        href={PUBLIC_URL.product(item.product.id)}
        className="relative h-28 w-28 rounded-md overflow-hidden"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.title}
          fill
          className="object-cover"
        />
      </Link>
      <div className="ml-6">
          <div className='flex justify-between items-center'>
          <h2 className="text-[16px] font-heebo truncate w-full max-w-[200px]">{item.product.title}</h2>
          <FavoriteButton product={item.product} />
		  </div>
        
      <div className='flex items-center justify-between'>
        <div className="flex items-center gap-[10px]">
        <p className="text-sm font-heebo mt-1">{formatPrice(item.product.price)}</p>
        <p className="text-[#BDBDBD]">|</p>
        <p className="text-sm font-heebo mt-1 text-[#BDBDBD]">{item.product.color.name}</p>
        </div>
        <CartActions item={item} />
		  </div>
    </div>
    </div>
  );
}
