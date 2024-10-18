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

export function PayCartItem({ item }: CartItemProps) {
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
    </div>
  );
}
