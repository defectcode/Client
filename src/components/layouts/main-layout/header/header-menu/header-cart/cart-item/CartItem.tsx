import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PUBLIC_URL } from '@/config/url.config';
import { ICartItem } from '@/shared/types/cart.interface';
import { formatPrice } from '@/utils/string/format-price';
import { CartActions } from './CartActions';
import { useDispatch } from 'react-redux';
import { FavoriteButton } from '@/app/(root)/product/[id]/product-info/FavoriteButton';
import { cartSlice } from '@/store/cart/cart.slice';

interface CartItemProps {
  item: ICartItem;
  isLastItem: boolean;
  isSingleItem: boolean;
}

export function CartItem({ item, isLastItem, isSingleItem }: CartItemProps) {
  const dispatch = useDispatch();

  // State for color dropdown
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(item.product.color.name);

  // Available colors
  const availableColors = ['Light gray', 'Blue', 'Red', 'Black'];

  const handleRemoveItem = () => {
    dispatch(cartSlice.actions.removeFromCart({ id: item.id }));
  };

  const toggleColorDropdown = () => {
    setColorDropdownOpen(prev => !prev);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setColorDropdownOpen(false);
  };

  return (
    <div
      className={`flex items-center relative ${
        !isLastItem && !isSingleItem ? 'border-b border-[#000000]/10' : ''
      } py-4`}
    >
      {/* Product Image */}
      <Link
        href={PUBLIC_URL.product(item.product.id)}
        className="relative h-[90px] w-[90px] overflow-hidden flex items-center justify-center bg-white border border-transparent"
      >
        <Image
          src={item.product.images[0]}
          alt={item.product.title}
          width={90}
          height={90}
          className="object-cover w-full h-full"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col ml-4 w-3/4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[15px] font-semibold truncate max-w-[300px]">{item.product.title}</h2>
          <FavoriteButton product={item.product} />
        </div>

        {/* Color Selector */}
        <div className="flex items-center gap-1 cursor-pointer mt-[20px]" onClick={toggleColorDropdown}>
          <p className="text-sm text-gray-500">{selectedColor}</p>
          <Image
            src="/images/arr.svg"
            alt="dropdown arrow"
            width={12}
            height={10}
            className={`text-[#8C8C8C] transition-transform duration-300 ${colorDropdownOpen ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Color Dropdown */}
        {colorDropdownOpen && (
          <div className="absolute bg-white shadow-lg border left-0">
            {availableColors.map((color) => (
              <div
                key={color}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => selectColor(color)}
              >
                {color}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-5 w-full h-[12px]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <p>{formatPrice(item.product.price)}</p>
          </div>
          <CartActions item={item} />
        </div>
      </div>
    </div>
  );
}
