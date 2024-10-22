import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import './cart-item/PayPal.css';
import Image from 'next/image';

export function CheckoutCartHeader() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const { items, total } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const estimatedTax = total * 0.2;
  const finalTotal = total + estimatedTax;

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="relative">
        {/* Butonul pentru a deschide sumarul comenzii, doar pe mobil */}
      <div className="block md:hidden">
        <div
          className="flex items-center justify-between cursor-pointer px-5 py-4 bg-white rounded-lg shadow"
          onClick={handleToggleSummary}
        >
          <h2 className="text-[16px] font-heebo">Show order summary</h2>
          <p className="font-semibold text-[16px]">{formatPrice(finalTotal)}</p>
        </div>

        {/* Overlay negru semi-transparent */}
        {isSummaryVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
            onClick={handleToggleSummary}
          ></div>
        )}

        {/* Popup-ul animat care coboară din buton */}
        <div
          className={`absolute left-0 right-0 transform transition-all duration-700 ease-in-out bg-white rounded-lg shadow-lg z-50 mt-2 ${
            isSummaryVisible ? 'max-h-[80vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-5'
          }`}
          style={{
            transformOrigin: 'top',
            overflow: 'hidden',
            transitionProperty: 'max-height, opacity, transform',
          }}
        >
          <div className="py-4">
            <div className="bg-[#F9F9F9] px-4 pt-4  rounded-b-[10px] rounded-t-none overflow-y-auto max-h-[300px]">
              {items.length ? (
                items.map((item) => (
                  <CheckoutCartItem item={item} key={item.id} />
                ))
              ) : (
                <div className="text-sm text-muted-foreground">The cart is empty!</div>
              )}
            </div>

            {/* Secțiunea statică cu prețul total și alte informații */}
            <div className="px-5 pt-5 pb-10 bg-white rounded-lg">
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Subtotal:</p>
                <span className='text-[#5D5D5D]'>{formatPrice(total)}</span>
              </div>
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Shipping:</p>
                <span className='text-[#5D5D5D]'>FREE</span>
              </div>
              <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                <p>Estimated Tax:</p>
                <span className='text-[#5D5D5D]'>{formatPrice(estimatedTax)}</span>
              </div>
              <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111] border-t border-b border-[#E8E8ED] py-5">
                <p>Total:</p>
                {formatPrice(finalTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structura desktop */}
      <div className="md:block hidden">
        <div className="py-4 bg-white max-w-[300px]">
          <div className="flex items-center justify-between cursor-pointer gap-10" style={{ fontFamily: 'Heebo, sans-serif' }} onClick={handleToggleSummary} >
            <div className="flex items-center gap-[10px]" >
              <h2 className="text-[16px] font-heebo" style={{ fontSize: '16px', fontWeight: '400', lineHeight: '20px', color: '#1E1E1E' }}>Show order summary</h2>
              <span
                className={` transform transition-transform duration-300 ${
                  isSummaryVisible ? 'rotate-180' : 'rotate-0'
                }`}
              >
                  <Image src='/images/arro.svg' alt='arro' width={12} height={7} />
              </span>
            </div>
            <p className="font-semibold text-[16px]" style={{ fontSize: '16px', fontWeight: '600', lineHeight: '20px', color: '#1E1E1E' }}>{formatPrice(finalTotal)}</p>
          </div>

          {isSummaryVisible && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-70 z-40"
                onClick={handleToggleSummary}
              ></div>

              {/* Drawer-ul adaptat pentru desktop */}
              <div
                className={`fixed top-0 m-5 ${window.innerWidth < 768 ? 'left-0 w-full' : 'right-0 w-[400px] max-h-[850px]'} bg-white shadow-lg z-50 rounded-lg transform transition-transform duration-300 ${
                  isSummaryVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
                style={{
                  maxHeight: '833px',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 p-5">
                    <h2 className="text-[18px] font-semibold font-heebo">Your Order Total</h2>
                    <button
                      className="text-[16px] text-black"
                      onClick={handleToggleSummary}
                    >
                      ✖
                    </button>
                  </div>

                  {/* Secțiunea de produse */}
                  <div
                    className="bg-[#F9F9F9] p-4 rounded-lg overflow-y-auto flex-grow custom-scrollbar"
                    style={{ maxHeight: '600px' }}
                  >
                    {items.length ? (
                      items.map((item) => (
                        <CheckoutCartItem item={item} key={item.id} />
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">The cart is empty!</div>
                    )}
                  </div>

                  {/* Secțiunea statică cu prețul total și alte informații */}
                  <div className="p-10 bg-white rounded-lg">
                    <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                      <p>Subtotal:</p>
                      <span className='text-[#5D5D5D]'>{formatPrice(total)}</span>
                    </div>
                    <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                      <p>Shipping:</p>
                      <span className='text-[#5D5D5D]'>FREE</span>
                    </div>
                    <div className="text-lg font-medium mt-[5px] flex items-center justify-between font-heebo text-[16px] text-[#111111]">
                      <p>Estimated Tax:</p>
                      <span className='text-[#5D5D5D]'>{formatPrice(estimatedTax)}</span>
                    </div>
                    <div className="text-lg font-bold mt-4 flex items-center justify-between font-heebo text-[16px] text-[#111111] border-t border-b border-[#E8E8ED] py-5">
                      <p>Total:</p>
                      {formatPrice(finalTotal)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
