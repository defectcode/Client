import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/string/format-price';
import { CheckoutCartItem } from './cart-item/CheckoutCartItem';
import './cart-item/PayPal.css';
import Image from 'next/image';
import { Logo } from '../../logo/Logo';

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
    <div className="relative flex items-center justify-between bg-[#F9F9F9]">
      {/* Background overlay for non-summary elements when summary is open */}
      {isSummaryVisible && (
        <div className="fixed inset-0 bg-[#000000] bg-opacity-60 z-40" onClick={handleToggleSummary}></div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden block w-full">
        {isSummaryVisible ? (
          // Render Logo and Summary inside the drawer when open
          <div className="absolute inset-x-0 top-0 bg-white z-50 py-4 px-5 flex items-center justify-between border-b">
            <div className="w-[77px] h-[18px]">
              <Logo />
            </div>
            <div
              className="flex items-center gap-2 text-[16px] font-Heebo-med text-[#1E1E1E]"
              onClick={handleToggleSummary}
            >
              <span>Summary</span>
              <p>{formatPrice(finalTotal)}</p>
              <Image
                src="/images/arr.svg"
                alt="arr"
                width={10}
                height={5}
                className={`transition-transform duration-300 ${isSummaryVisible ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>

          </div>
        ) : (
          // Render Logo and Summary as usual in the header when summary is closed
          <div className="flex items-center justify-between bg-[#F9F9F9] px-5 py-4 w-full">
            <div className="w-[77px] h-[18px]">
              <Logo />
            </div>
            <div className="flex items-center gap-2 text-[16px] font-Heebo-med text-[#1E1E1E]" onClick={handleToggleSummary}>
              <span>Summary</span>
              <p>{formatPrice(finalTotal)}</p>
              <Image
                src="/images/arr.svg"
                alt="arr"
                width={10}
                height={5}
                className={`transition-transform duration-300 ${isSummaryVisible ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          </div>
        )}

        {/* Drawer for Summary */}
        <div
          className={`fixed inset-x-0 top-0 transform transition-all duration-300 ease-in-out bg-white shadow-lg z-50 mt-12 ${
            isSummaryVisible ? 'max-h-[80vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-5'
          }`}
          style={{
            transformOrigin: 'top',
            overflow: 'hidden',
            transitionProperty: 'max-height, opacity, transform',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
          }}
        >
          <div className="pb-5">
            <div className="p-5 relative overflow-y-auto" style={{ maxHeight: '300px' }}>
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


            {/* Static Section with Total Price and Other Information */}
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
      </div>


      {/* Structura desktop */}
      <div className="md:block hidden">
        <div className="py-4 bg-[#F9F9F9] max-w-[300px]">
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
                className="fixed inset-0 bg-[#000000] bg-opacity-60 z-40"
                onClick={handleToggleSummary}
              ></div>

              {/* Drawer-ul adaptat pentru desktop */}
              <div
                className={`fixed ${window.innerWidth < 768 ? 'left-0 w-full' : 'right-0 w-[400px]'} bg-white z-50 transform transition-transform duration-300 ${
                  isSummaryVisible ? 'top-[20px]' : '-top-full'
                }`}
                style={{
                  bottom: '20px', // Setează distanța de jos la 20px
                  height: 'calc(100vh - 40px)', // Înălțimea ajustată pentru a lăsa 20px sus și jos
                  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                  overflowY: 'auto',
                  borderTopLeftRadius: '20px', 
                  borderBottomLeftRadius: '20px', 
                }}
              >
                <div className="flex flex-col h-full ">
                  <div className="flex items-center justify-between h-[56px] p-5 bg-white">
                    <h2 className="font-Heebo-17 text-[16px] text-[#1E1E1E]">Your Order Summary</h2>
                    <button
                      className="text-[16px] text-black"
                      onClick={handleToggleSummary}
                    >
                      <Image src='/images/close.svg' alt='close' width={14} height={14}/>
                    </button>
                  </div>
                  <div className="shadow-container">
                    <div className="shadow-top"></div> {/* Gradientul de sus */}
                    
                    <div className="scroll-content no-scrollbar custom-scrollbar">
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

                    <div className="shadow-bottom"></div> {/* Gradientul de jos */}
                  </div>

                  {/* Secțiunea statică cu prețul total și alte informații */}
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

            </>
          )}
        </div>
      </div>
    </div>
  );
}
