'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { PUBLIC_URL } from '@/config/url.config';
import { useCart } from '@/hooks/useCart';
import { useProfile } from '@/hooks/useProfile';
import { formatPrice } from '@/utils/string/format-price';
import { PayCartItem } from './cart-item/PayCartItem';
import { useCheckout } from './useCheckout';
import PayPalButton from './cart-item/PayPalButton';

import './cart-item/PayPal.css'
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';

export function CheckoutCart() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // Controlăm vizibilitatea sumarului
  const [isExpressDelivery, setIsExpressDelivery] = useState(false); // Controlăm tipul de livrare
  const router = useRouter();
  const { createPayment, isLoadingCreate } = useCheckout();
  const { user } = useProfile();
  const { items, total } = useCart();

  const estimatedTax = total * 0.2;
  const expressDeliveryCost = 19.00; // Costul livrării expres

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  const handleToggleDelivery = () => {
    setIsExpressDelivery(!isExpressDelivery);
  };

  const handleClick = () => {
    user ? createPayment() : router.push(PUBLIC_URL.auth());
  };

  const finalTotal = total + estimatedTax + (isExpressDelivery ? expressDeliveryCost : 0); // Calculăm totalul în funcție de livrare

  return (
    <div>
      <div className='md:block hidden'>
        <h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242]">Delivery Method</h2>
        <div className="flex items-center justify-between border p-5 rounded-[10px] mb-10 h-[56px]">
          <h3 className="text-[#1E1E1E] font-heebo font-semibold text-[16px]">Delivers Oct 22 - Oct 29</h3>
          <p className="text-[#8C8C8C] font-heebo font-medium text-[14px]">FREE</p>
        </div>
      </div>

      <div className="py-4 bg-white border md:rounded-lg max-w-[430px] mx-auto">
        {/* Butonul pentru a afișa/ascunde sumarul comenzii */}
        <div className="flex items-center justify-between cursor-pointer px-5" onClick={handleToggleSummary}>
          <Heading title="Show order summary" className="text-[16px] font-heebo" />
          <p className="font-semibold text-[16px]">{formatPrice(finalTotal)}</p>
        </div>

        {/* Vizibilitatea întregului conținut controlată de isSummaryVisible */}
        {isSummaryVisible && (
          <>
            {/* Sumarul comenzii */}
            <div className="bg-[#F9F9F9] p-4 transition-all duration-300 ease-in-out"> {/* Fundal gri adăugat */}
              <div className="flex flex-col w-full flex-1">
                {items.length ? (
                  <div className="max-h-[300px] overflow-y-scroll custom-scrollbar mb-4"> {/* Adăugat custom-scrollbar */}
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
                <span>{isExpressDelivery ? `$${expressDeliveryCost}` : 'FREE'}</span> {/* Afișăm costul livrării */}
              </div>
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Estimated Tax:</p>
                <span>{formatPrice(estimatedTax)}</span> {/* Afișăm suma taxei estimate */}
              </div>
              <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Total to be paid:</p>
                {formatPrice(finalTotal)} {/* Afișăm totalul + taxa + livrarea */}
              </div>
            </div> 
          </>
        )}
      </div>
      <div className='md:hidden mt-10 px-5'>
        <h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242]">Delivery Method</h2>
        <div className="flex items-center justify-between border p-5 rounded-[10px] mb-10 h-[56px]">
          <h3 className="text-[#1E1E1E] font-heebo font-semibold text-[16px]">Delivers Oct 22 - Oct 29</h3>
          <p className="text-[#8C8C8C] font-heebo font-medium text-[14px]">FREE</p>
        </div>
      </div>
    </div>
  );
}
