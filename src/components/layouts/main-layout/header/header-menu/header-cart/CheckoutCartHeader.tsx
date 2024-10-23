import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import './cart-item/PayPal.css';
import Image from 'next/image';

export function CheckoutCartHeader() {
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const { items, total } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculul corect al numărului total de articole
  const totalItemsCount = items.reduce((accumulator, item) => accumulator + item.quantity, 0);
  const itemText = totalItemsCount === 1 ? 'item' : 'items';

  const estimatedTax = total * 0.2;
  const finalTotal = total + estimatedTax;

  const handleToggleSummary = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isSummaryVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup la demontare
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSummaryVisible]);

  return (
    <div className="relative">
      {/* Butonul pentru a deschide sumarul comenzii, doar pe mobil */}
      <div className="block md:hidden">
        <div
          className="flex items-center justify-between cursor-pointer px-5 py-4 bg-white rounded-[10px]"
          onClick={handleToggleSummary}
        >
          <div className='flex flex-row gap-[10px]'>
            <h2 className="text-[14px] font-Heebo-med text-[#1E1E1E]">
              {isSummaryVisible ? 'Hide order summary' : 'Show order summary'}
            </h2>
            <Image 
              src='/images/arr.svg' 
              alt='arr' 
              width={10} 
              height={5} 
              className={`transition-transform duration-300 ${isSummaryVisible ? 'rotate-180' : 'rotate-0'}`} 
            />
          </div>
          <p className="font-Heebo-16 text-[16px]">{formatPrice(finalTotal)}</p>
        </div>

        {/* Overlay negru semi-transparent */}
        {isSummaryVisible && (
          <div
            className="fixed inset-0 bg-[#1E1E1E] max-h-[80vh] bg-opacity-90 z-40 md:hidden mt-44"
            onClick={handleToggleSummary}
          ></div>
        )}

        {/* Popup-ul animat care coboară din buton */}
        <div
          className={`absolute left-0 right-0 transform transition-all duration-0 ease-in-out bg-white shadow-lg z-50 mt-2 ${
            isSummaryVisible ? 'max-h-[80vh] opacity-100 translate-y-0 rounded-t-lg' : 'max-h-0 opacity-0 -translate-y-5'
          }`}
          style={{
            transformOrigin: 'top',
            overflow: 'hidden',
            transitionProperty: 'max-height, opacity, transform',
            borderBottomLeftRadius: '10px', // Rotunjire colțuri jos
            borderBottomRightRadius: '10px', // Rotunjire colțuri jos
          }}
        >
          <div className="pb-5">
            <div className="bg-[#F9F9F9] px-4 pt-4 rounded-b-[10px] overflow-y-auto max-h-[300px]">
              {items.length ? (
                items.map((item) => (
                  <CheckoutCartItem item={item} key={item.id} isLastItem={false} />
                ))
              ) : (
                <div className="text-sm text-muted-foreground">The cart is empty!</div>
              )}
            </div>

            {/* Secțiunea statică cu prețul total și alte informații */}
            <div className="px-5 pt-5 bg-white rounded-[10px] text-">
              <div className="flex items-center justify-between text-[#111111] font-Heebo-16 text-[16px] mb-5">
                <p>{`${totalItemsCount} ${itemText}`}</p>
                <a href="/bag" className="text-[#5D5D5D] font-Heebo-med-16 underline">Edit Bag</a>
              </div>
              <div className='border-t border-b border-[#E8E8ED] py-5 font-Heebo-med-16 text-[#111111]'>
                <div className="font-medium flex items-center justify-between">
                  <p>Subtotal:</p>
                  <span className='text-[#5D5D5D]'>{formatPrice(total)}</span>
                </div>
                <div className="font-medium mt-[10px] flex items-center justify-between">
                  <p>Shipping:</p>
                  <span className='text-[#5D5D5D]'>FREE</span>
                </div>
                <div className="font-medium mt-[10px] flex items-center justify-between">
                  <p>Estimated Tax:</p>
                  <span className='text-[#5D5D5D]'>{formatPrice(estimatedTax)}</span>
                </div>
              </div>
              <div className="font-Heebo-16 text-[#111111] mt-5 flex items-center justify-between">
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
                className="fixed inset-0 bg-[#1E1E1E] bg-opacity-90 z-40"
                onClick={handleToggleSummary}
              ></div>

              {/* Drawer-ul adaptat pentru desktop */}
              <div
                className={`fixed ${window.innerWidth < 768 ? 'left-0 w-full' : 'right-0 w-[400px]'} bg-white z-50 transform transition-transform duration-300 ${
                  isSummaryVisible ? 'top-0' : '-top-full'
                }`}
                style={{
                  height: '100vh',
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                  overflowY: 'auto',
                  borderTopLeftRadius: '20px', 
                  borderBottomLeftRadius: '20px', 
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between h-[56px] px-5 bg-white rounded-t-[20px]">
                    <h2 className="text-[16px] font-Heebo-med font-semibold text-[#1E1E1E]">Hide order summary</h2>
                    <button
                      className="text-[16px] text-black"
                      onClick={handleToggleSummary}
                    >
                      <Image src='/images/close.svg' alt='close' width={12} height={12}/>
                    </button>
                  </div>

                  {/* Secțiunea de produse */}
                  <div
                    className="bg-[#F9F9F9] p-5 overflow-y-auto flex-grow custom-scrollbar"
                    style={{ maxHeight: 'calc(100vh - 112px)' }}
                  >
                    {items.length ? (
                      items.map((item) => (
                        <CheckoutCartItem item={item} key={item.id} isLastItem={false} />
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">The cart is empty!</div>
                    )}
                  </div>

                  {/* Secțiunea statică cu prețul total și alte informații */}
                  <div className="px-5 pt-5 bg-white">
                    <div className="flex items-center justify-between text-[#111111] font-Heebo-16 text-[16px] mb-[10px]">
                      <p>{`${totalItemsCount} ${itemText}`}</p>
                      <a href="/bag" className="text-[#5D5D5D] underline font-Heebo-med-16">Edit Bag</a>
                    </div>
                    <div className='border-t border-b border-[#E8E8ED] py-5 font-Heebo-med-16 text-[#111111]'>
                      <div className="font-medium flex items-center justify-between">
                        <p>Subtotal:</p>
                        <span className='text-[#5D5D5D]'>{formatPrice(total)}</span>
                      </div>
                      <div className="font-medium mt-[10px] flex items-center justify-between">
                        <p>Shipping:</p>
                        <span className='text-[#5D5D5D]'>FREE</span>
                      </div>
                      <div className="font-medium mt-[10px] flex items-center justify-between">
                        <p>Estimated Tax:</p>
                        <span className='text-[#5D5D5D]'>{formatPrice(estimatedTax)}</span>
                      </div>
                    </div>
                    <div className="font-Heebo-16 text-[#111111] my-5 flex items-center justify-between">
                      <p className='font-Heebo-16'>Total:</p>
                      <p className='font-Heebo-16'>{formatPrice(finalTotal)}</p>
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
