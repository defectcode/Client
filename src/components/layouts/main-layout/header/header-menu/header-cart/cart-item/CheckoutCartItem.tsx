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
}

export function CheckoutCartItem({ item }: CartItemProps) {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(cartSlice.actions.removeFromCart({ id: item.id }));
  };

  return (
    <div className="relative flex items-center mb-5">
      {/* Butonul pentru eliminarea produsului */}
      {/* <button
        onClick={handleRemoveItem}
        className="absolute top-0 right-0 bg-transparent text-gray-600 hover:text-red-600 p-1 rounded-full focus:outline-none"
        aria-label="Remove item"
      >
        &times;
      </button> */}

      {/* Imaginea produsului */}
      <div className="relative h-28 w-28 rounded-md overflow-visible"> {/* overflow-visible asigură că eticheta nu este tăiată */}
        <Link href={PUBLIC_URL.product(item.product.id)}>
          <Image
            src={item.product.images[0]}
            alt={item.product.title}
            layout="fill"
            objectFit="cover"
          />
        </Link>

        {/* Cantitatea produsului afișată în colțul din dreapta sus */}
        <span
          className="absolute bg-[#5E5E5E] text-white text-xs font-bold font-heebo rounded-full flex items-center justify-center w-5 h-5"
          style={{
            top: '-10px', // Poziționare mai sus
            right: '-10px',
            lineHeight: '30px',
            borderRadius: '50%',
            zIndex: 50, // Asigurăm că eticheta este vizibilă
          }}
        >
          {item.quantity}
        </span>
      </div>

      {/* Detalii despre produs */}
      <div className="ml-6 flex flex-col">
        <h2 className="text-[16px] font-heebo truncate w-full max-w-[200px]">
          {item.product.title}
        </h2>
        <div className="flex items-center gap-[10px] mt-2">
          <p className="text-sm font-heebo">{formatPrice(item.product.price)}</p>
          <p className="text-[#BDBDBD]">|</p>
          <p className="text-sm font-heebo text-[#BDBDBD]">{item.product.color.name}</p>
        </div>
      </div>
    </div>
  );
}
