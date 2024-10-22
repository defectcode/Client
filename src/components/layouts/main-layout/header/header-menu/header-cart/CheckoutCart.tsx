import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import './cart-item/PayPal.css';

export function CheckoutCart() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // Controlăm vizibilitatea sumarului
  const router = useRouter();
  const { items, total } = useCart();

  const estimatedTax = total * 0.2;
  const finalTotal = total + estimatedTax;

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  return (
    <div className="relative">
      {/* Overlay pentru când drawer-ul este deschis, doar pentru mobil */}
      {isSummaryVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleToggleSummary}
        ></div>
      )}

      {/* Drawer-ul mobil */}
      <div
        className={`fixed inset-x-0 top-0 transform transition-transform duration-300 bg-white rounded-t-lg z-50 md:hidden ${
          isSummaryVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ height: '60vh' }}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
           <div className='flex gap-1'>
            <h2 className="text-[16px] font-semibold font-heebo">Order Summary</h2>
              <button
                className="text-[14px] text-black"
                onClick={handleToggleSummary}
              >
                ▲
              </button>
           </div>
            <p className="font-semibold text-[16px]">{formatPrice(finalTotal)}</p>
          </div>

          {/* Secțiunea de produse cu scroll independent */}
          <div className="bg-[#F9F9F9] p-4 rounded-lg overflow-y-auto flex-grow mb-4">
            {items.length ? (
              items.map((item) => (
                <CheckoutCartItem item={item} key={item.id} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">The cart is empty!</div>
            )}
          </div>

          {/* Secțiunea statică cu prețul total și alte informații */}
          <div className="p-4 bg-white rounded-lg">
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
              <span>{formatPrice(estimatedTax)}</span>
            </div>
            <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111]">
              <p>Totaldsds:</p>
              {formatPrice(finalTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Butonul pentru a deschide sumarul comenzii, doar pe mobil */}
      <div className="block md:hidden mb-4">
        <div
          className="flex items-center justify-between cursor-pointer px-5 py-4 bg-white md:border md:rounded-lg"
          onClick={handleToggleSummary}
        >
          <h2 className="text-[16px] font-heebo">Show order summary</h2>
          <p className="font-semibold text-[16px]">{formatPrice(finalTotal)}</p>
        </div>
      </div>

      {/* Structura desktop rămâne neschimbată */}
      <div className="md:block hidden">
        <div className="py-4 bg-white border rounded-lg max-w-[430px] mx-auto">
          <div className="flex items-center justify-between cursor-pointer px-5" onClick={handleToggleSummary}>
            <h2 className="text-[16px] font-heebo">Show order summary</h2>
            <p className="font-semibold text-[16px]">{formatPrice(finalTotal)}</p>
          </div>

          {isSummaryVisible && (
            <>
              <div className="bg-[#F9F9F9] p-4 transition-all duration-300 ease-in-out">
                <div className="flex flex-col w-full flex-1">
                  {items.length ? (
                    <div className="max-h-[300px] overflow-y-scroll custom-scrollbar mb-4">
                      {items.map((item) => (
                        <CheckoutCartItem item={item} key={item.id} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">The cart is empty!</div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg">
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
                  <span>{formatPrice(estimatedTax)}</span>
                </div>
                <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                  <p>Total:</p>
                  {formatPrice(finalTotal)}
                </div>
              </div> 
            </>
          )}
        </div>
      </div>
    </div>
  );
}
