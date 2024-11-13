'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CartItem } from './cart-item/CartItem';
import CheckoutButton from '@/app/checkout/ButtonCheckout';
import './cart-item/PayPal.css';
import Image from 'next/image';

export function HeaderCart() {
  const router = useRouter();
  const { items, total } = useCart();
  const [isCartVisible, setIsCartVisible] = useState(true); // Stare pentru vizibilitate

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible); // Inversăm vizibilitatea când se apasă butonul
  };

  return (
    <div className="flex flex-col max-w-[430px] w-full bg-white rounded-lg ">
      {/* Titlu coș cu numărul de articole și buton pentru deschidere/închidere */}
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleCartVisibility}>
        <div className='flex gap-1'>
          <Heading title={`Your Shopping Bag`} className="text-xl" />
          <span className="text-lg font-semibold text-[#8C8C8C]">{`(${items.length})`}</span> {/* Arătăm numărul de articole */}
        </div>
        <span className="text-lg font-semibold">{isCartVisible ? '' : ''}</span> {/* Indicator deschis/închis */}
      </div>

      {/* Conținutul coșului este afișat doar dacă secțiunea este vizibilă */}
      {isCartVisible && (
        <>
          {/* Lista de produse */}
          <div className="flex flex-col bg-[#F9F9F9] m-0 w-full flex-1 max-h-[450px] overflow-y-auto custom-scrollbar p-4">
            {items.length ? (
              items.map((item) => (
                <CartItem item={item} key={item.id} isLastItem={false} isSingleItem={false} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">The cart is empty!</div>
            )}
          </div>

          {/* Subtotal și butoane de plată */}
          {items.length ? (
            <div className="pt-4 p-4">
              <div className="flex justify-between text-lg font-semibold mb-4 font-heebo">
                <span>Subtotal:</span>
                <span className='font-bold font-heebo text-[16px]'>{formatPrice(total)}</span>
              </div>
              <div className='space-y-[10px] w-full'>
                <button className="w-full mb-2 bg-black flex items-center justify-center h-[48px] rounded-[10px]">
                  <Image src='/images/applepayBlack.svg' alt='applepay' width={42} height={16} className='' />
                </button>
                <CheckoutButton />
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
