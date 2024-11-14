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
  const [isCartVisible, setIsCartVisible] = useState(false); // Start with cart hidden by default

  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <>
      {/* Desktop Header - Always visible */}
      <div className="flex items-center justify-between p-4 cursor-pointer md:flex hidden" onClick={toggleCartVisibility}>
        <div className="flex gap-1">
          <Heading title="Your Shopping Bag" className="text-xl" />
          <span className="text-lg font-semibold text-[#8C8C8C]">{`(${items.length})`}</span>
        </div>
      </div>

      {/* Mobile and Desktop Cart Container - Visible based on isCartVisible */}
      {isCartVisible && (
        <>
          {/* Overlay for mobile and desktop to close the cart when clicked outside */}
          <div 
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={toggleCartVisibility} // Close cart on overlay click
          ></div>

          {/* Cart Component */}
          <div
            className="flex flex-col max-w-[430px] w-full bg-white rounded-lg 
                       md:relative md:mx-auto md:mt-4 
                       fixed bottom-0 inset-x-0 md:max-w-md z-50 pb-5 shadow-lg"
          >
            {/* Mobile Header with Close Button */}
            <div className="flex items-center justify-between p-4 px-5 md:hidden">
              <div className="flex gap-1">
                <Heading title="Your Shopping Bag" className="text-xl" />
                <span className="text-lg font-semibold text-[#8C8C8C]">
                  {`(${items.length})`}
                </span>
              </div>
              {/* Close button (X) for mobile */}
              <button
                className="text-xl font-bold text-gray-600 hover:text-gray-800"
                onClick={toggleCartVisibility}
              >
                ×
              </button>
            </div>

            {/* Product list with gradient shadows */}
            <div className="shadow-container">
              {/* Gradient at the top */}
              <div className="shadow-top"></div>

              {/* Scrollable product list */}
              <div className="scroll-content">
                {items.length ? (
                  items.map((item) => (
                    <CartItem
                      item={item}
                      key={item.id}
                      isLastItem={false}
                      isSingleItem={false}
                    />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    The cart is empty!
                  </div>
                )}
              </div>

              {/* Gradient at the bottom */}
              <div className="shadow-bottom"></div>
            </div>

            {/* Subtotal and payment buttons */}
            {items.length ? (
              <div className="pt-4 px-5">
                <div className="flex justify-between text-lg font-semibold mb-4 font-heebo">
                  <span>Subtotal:</span>
                  <span className="font-bold font-heebo text-[16px]">
                    {formatPrice(total)}
                  </span>
                </div>
                <div className="space-y-[10px] w-full">
                  <button className="w-full mb-2 bg-black flex items-center justify-center h-[48px] rounded-[10px]">
                    <Image
                      src="/images/applepayBlack.svg"
                      alt="applepay"
                      width={42}
                      height={16}
                    />
                  </button>
                  <CheckoutButton />
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}
