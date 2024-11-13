import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import Image from 'next/image';
import { Logo } from '../../logo/Logo';

export function CheckoutForProduct() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const { items, total } = useCart();

  // Calculul corect al numărului total de articole
  const totalItemsCount = items.reduce((accumulator, item) => accumulator + item.quantity, 0);
  const itemText = totalItemsCount === 1 ? 'item' : 'items';

  const estimatedTax = total * 0.2;
  const finalTotal = total + estimatedTax;

  useEffect(() => {
    // Deschide automat fereastra când un produs este adăugat
    if (totalItemsCount > 0) {
      setIsSummaryVisible(true);
      const timer = setTimeout(() => {
        setIsSummaryVisible(false); // Ascunde fereastra după 7 secunde
      }, 7000);

      return () => clearTimeout(timer); // Curățare la demontare
    }
  }, [totalItemsCount]);

  return (
    <div className="relative flex items-center justify-between bg-[#F9F9F9]">
      {/* Versiunea mobil */}
      <div className="md:hidden block h-[48px] bg-[#F9F9F9] px-[20px] w-full">
        {isSummaryVisible && (
          <div className={`absolute left-0 right-0 transform transition-all duration-300 ease-in-out bg-white shadow-lg z-50 mt-2`}>
            <div className="pb-5">
              <div className="p-5 relative flex-grow overflow-y-auto shadow-container">
                {items.length ? (
                  items.map((item, index) => (
                    <CheckoutCartItem
                      item={item}
                      key={item.id}
                      isLastItem={index === items.length - 1}
                      isSingleItem={items.length === 1}
                    />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">The cart is empty!</div>
                )}
              </div>
              <div className="px-5 pt-5 bg-white rounded-[10px]">
                <div className="flex items-center justify-between font-Heebo-16 text-[16px] mb-5">
                  <p className="text-[#111111]">{`${totalItemsCount} ${itemText}`}</p>
                  <a href="/bag" className="font-Heebo-med--16 underline text-[#5D5D5D]">
                    Edit Bag
                  </a>
                </div>
                <div className="border-t border-b border-[#E8E8ED] py-5 font-Heebo-med-16 text-[#111111]">
                  <div className="font-medium flex items-center justify-between">
                    <p>Subtotal:</p>
                    <span className="text-[#5D5D5D]">{formatPrice(total)}</span>
                  </div>
                  <div className="font-medium mt-[10px] flex items-center justify-between">
                    <p>Shipping:</p>
                    <span className="text-[#5D5D5D]">FREE</span>
                  </div>
                  <div className="font-medium mt-[10px] flex items-center justify-between">
                    <p>Estimated Tax:</p>
                    <span className="text-[#5D5D5D]">{formatPrice(estimatedTax)}</span>
                  </div>
                </div>
                <div className="font-Heebo-16 text-[#111111] mt-5 flex items-center justify-between">
                  <p>Total</p>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Versiunea desktop */}
      <div className="md:block hidden">
      {isSummaryVisible && (
        <div className="fixed inset-0 bg-[#000000]/60 z-40 flex justify-end">
          <div
            className="w-[400px] bg-white z-50 transform transition-transform duration-300 overflow-hidden"
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              height: 'calc(100vh - 40px)',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              borderTopLeftRadius: '20px', // Rotunjire doar pe colțul din stânga sus
              borderBottomLeftRadius: '20px', // Rotunjire doar pe colțul din stânga jos
            }}
          >
            <div className="flex items-center justify-between h-[56px] p-5 bg-white">
              <h2 className="font-Heebo-17 text-[16px] text-[#1E1E1E]">Your Shopping Bag</h2>
              <button
                className="text-[16px] text-black"
                onClick={() => setIsSummaryVisible(false)}
              >
                <Image src='/images/close.svg' alt='close' width={14} height={14}/>
              </button>
            </div>
            <div className="shadow-container p-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
              {items.length ? (
                items.map((item, index) => (
                  <CheckoutCartItem
                    item={item}
                    key={item.id}
                    isLastItem={index === items.length - 1}
                    isSingleItem={items.length === 1}
                  />
                ))
              ) : (
                <div className="text-sm text-muted-foreground">The cart is empty!</div>
              )}
            </div>
            <div className="px-5 pt-5 bg-white">
              <div className="flex items-center justify-between text-[#111111] font-Heebo-16 text-[16px] mb-5">
                <p>{`${totalItemsCount} ${itemText}`}</p>
                <a href="/bag" className="underline font-Heebo-med--16 text-[#5D5D5D]">Edit Bag</a>
              </div>
              <div className='border-t border-b border-[#E8E8ED] py-5 text-[#111111]'>
                <div className="font-medium flex items-center justify-between">
                  <p className='font-Heebo-reg-16'>Subtotal:</p>
                  <span className='font-Heebo-reg-16 text-[#5D5D5D]'>{formatPrice(total)}</span>
                </div>
                <div className="font-medium mt-[10px] flex items-center justify-between">
                  <p className='font-Heebo-reg-16'>Shipping:</p>
                  <span className='font-Heebo-reg-16 text-[#5D5D5D]'>FREE</span>
                </div>
                <div className="font-medium mt-[10px] flex items-center justify-between">
                  <p className='font-Heebo-reg-16'>Estimated Tax:</p>
                  <span className='font-Heebo-reg-16 text-[#5D5D5D]'>{formatPrice(estimatedTax)}</span>
                </div>
              </div>
              <div className="font-Heebo-16 text-[#111111] my-5 flex items-center justify-between">
                <p className='font-Heebo-16'>Total</p>
                <p className='font-Heebo-16'>{formatPrice(finalTotal)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
