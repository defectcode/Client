import Image from 'next/image';
import Link from 'next/link';

import { PUBLIC_URL } from '@/config/url.config';
import { ICartItem } from '@/shared/types/cart.interface';
import { formatPrice } from '@/utils/string/format-price';
import { useDispatch } from 'react-redux';
import { cartSlice } from '@/store/cart/cart.slice';

import './PayPal.css'

interface CartItemProps {
  item: ICartItem;
  isLastItem: boolean;
}

export function CheckoutCartItem({ item, isLastItem }: CartItemProps) {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(cartSlice.actions.removeFromCart({ id: item.id }));
  };

  return (
    <div className="relative flex flex-col">
      <div className="flex items-center">
        <div className="relative bg-white w-[100px] h-[100px] rounded-md overflow-visible flex items-center justify-center">
          <Link href={PUBLIC_URL.product(item.product.id)} className="relative">
            <Image
              src={item.product.images[0]}
              alt={item.product.title}
              width={92}
              height={92}
              className="object-cover w-[92px] h-[92px]"
            />
          </Link>

          {/* Cantitatea produsului afișată în colțul din dreapta sus */}
          <span
            className="absolute bg-[#8C8C8C]/50 text-white text-xs font-bold font-heebo rounded-full flex items-center justify-center w-5 h-5"
            style={{
              top: '-10px',
              right: '-10px',
              lineHeight: '30px',
              borderRadius: '50%',
              zIndex: 50,
            }}
          >
            {item.quantity}
          </span>
        </div>

        {/* Detalii despre produs */}
        <div className="ml-[10px] flex flex-col max-w-[200px] w-full space-y-5">
          <h2 className="font-Heebo-med-15 truncate max-w-full w-full text-[#1E1E1E]">
            {item.product.title}
          </h2>
          <div className="flex flex-col items-start justify-center space-y-5 font-Heebo-med text-[#8C8C8C] text-sm">
            <p className='font-Heebo-reg text-[13px]'>{item.product.color.name}</p>
            <p className='font-Heebo-reg text-[13px]'>{formatPrice(item.product.price)}</p>
          </div>
        </div>
      </div>

      {/* Linia de separare între produse */}
      {!isLastItem && (
        <div className=" border-t border-[#E8E8ED] my-5 md:max-w-[249px] max-w-[282px] w-full" style={{ marginLeft: '110px' }}></div>
      )}
    </div>
  );
}
