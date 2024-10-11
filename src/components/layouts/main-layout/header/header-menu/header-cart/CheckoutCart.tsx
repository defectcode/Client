'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { PUBLIC_URL } from '@/config/url.config';
import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useProfile';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import { useCheckout } from './useCheckout';
import PayPalButton from './cart-item/PayPalButton';

export function CheckoutCart() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // Controlăm vizibilitatea sumarului
  const router = useRouter();
  const { createPayment, isLoadingCreate } = useCheckout();
  const { user } = useProfile();
  const { items, total } = useCart();

  const estimatedTax = total * 0.2;

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible); 
  };

  const handleClick = () => {
    user ? createPayment() : router.push(PUBLIC_URL.auth());
  };

  return (
    <div>
      <h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242]">Delivery Method</h2>
      <div className="flex items-center justify-between border p-5 rounded-[10px] mb-10 h-[56px]">
        <h3 className="text-[#1E1E1E] font-heebo font-semibold text-[16px]">Delivers Oct 22 - Oct 29</h3>
        <p className="text-[#8C8C8C] font-heebo font-medium text-[14px]">FREE</p>
      </div>
      <div className="py-4 bg-white border rounded-lg max-w-[430px] mx-auto">
        
        {/* Butonul pentru a afișa/ascunde sumarul comenzii */}
        <div className="flex items-center justify-between cursor-pointer px-5" onClick={handleToggleSummary}>
          <Heading title="Show order summary" className="text-[16px] font-heebo" />
          <p className="font-semibold text-[16px]">{formatPrice(total)}</p>
        </div>

        {/* Vizibilitatea întregului conținut controlată de isSummaryVisible */}
        {isSummaryVisible && (
          <>
            {/* Sumarul comenzii */}
            <div className="bg-gray-100 p-4 border-t transition-all duration-300 ease-in-out"> {/* Fundal gri adăugat */}
              <div className="flex flex-col w-full flex-1">
                {items.length ? (
                  <div className="max-h-[300px] overflow-y-auto mb-4">
                    {items.map((item) => (
                      <CheckoutCartItem item={item} key={item.id} />
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">The cart is empty!</div>
                )}
              </div>
            </div>

            {/* Fundal alb pentru detaliile de prețuri */}
            <div className="p-4 bg-white rounded-lg ">
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Subtotal:</p>
                {formatPrice(total)}
              </div>
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Shipping:</p>
                <span>FREE</span>
              </div>
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Estimated Tax:</p>
                <span>{formatPrice(estimatedTax)}</span> {/* Afișăm suma taxei estimate */}
              </div>
              <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Total to be paid:</p>
                {formatPrice(total + estimatedTax)} {/* Afișăm totalul + taxa */}
              </div>
              {/* <Button
              onClick={handleClick}
              variant="primary"
              disabled={isLoadingCreate}
              className="w-full mt-4 bg-black hover:bg-gray-700"
              >
              Proceed to payment
              </Button>
              <PayPalButton totalAmount={total + estimatedTax} /> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
