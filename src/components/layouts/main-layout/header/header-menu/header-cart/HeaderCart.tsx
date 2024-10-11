'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';

import { PUBLIC_URL } from '@/config/url.config';

import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useProfile';

import { formatPrice } from '@/utils/string/format-price';

import { CartItem } from './cart-item/CartItem';
import { useCheckout } from './useCheckout';
import  PayPalButton from './cart-item/PayPalButton';
import CheckoutButton from '@/app/checkout/ButtonCheckout';

export function HeaderCart() {
  const router = useRouter();
  const { createPayment, isLoadingCreate } = useCheckout();
  const { user } = useProfile();
  const { items, total } = useCart();

  const handleClick = () => {
    user ? createPayment() : router.push(PUBLIC_URL.auth());
  };

  return (
    <div className="flex flex-col max-w-[430px] w-full p-4 bg-white shadow-lg rounded-lg">
      <Heading title="Shopping Cart" className="text-xl mb-4" />
      <div className="flex flex-col w-full flex-1">
        {items.length ? (
          <div className="max-h-[280px] overflow-y-auto">
            {items.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">The cart is empty!</div>
        )}
      </div>
      {items.length ? (
        <>
          <div className="text-lg font-medium mt-4 flex items-center justify-between">
            <p>Total to be paid:</p>
            {formatPrice(total)}
          </div>
          {/* <Button
            onClick={handleClick}
            variant="primary"
            disabled={isLoadingCreate}
            className="w-full mt-4 bg-black hover:bg-gray-700"
          >
            Proceed to payment
          </Button>

          {/* PayPal Button */}
          {/* <PayPalButton totalAmount={total} /> */} 
		  <CheckoutButton />
        </>
      ) : null}
    </div>
  );
}
