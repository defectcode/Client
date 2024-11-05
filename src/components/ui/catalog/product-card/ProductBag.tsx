'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/string/format-price'
import { PUBLIC_URL } from '@/config/url.config'
import { IProduct } from '@/shared/types/product.interface'
import ByNowButton from '@/app/(root)/product/[id]/product-info/ByNow'
import './ProductCard.css'
import { CartActions } from '@/components/layouts/main-layout/header/header-menu/header-cart/cart-item/CartActions'
import { FavoriteButton } from '@/app/(root)/product/[id]/product-info/FavoriteButton'

interface ProductCardCheckoutProps {
  product: IProduct
}

export function ProductBag({ product }: ProductCardCheckoutProps) {
  const { items } = useCart()
  const router = useRouter()
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'easyReturns': false,
    'securePayment': false,
    'youCanPayBy': false,
  })

  const [isMobile, setIsMobile] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState<{ [key: string]: boolean }>({})
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({})
  const availableColors = ['Light gray', 'Blue', 'Red', 'Black']


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Setăm dimensiunea pentru mobil
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleColorDropdown = (itemId: string) => {
    setColorDropdownOpen(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const selectColor = (itemId: string, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [itemId]: color,
    }))
    setColorDropdownOpen(prev => ({
      ...prev,
      [itemId]: false,
    }))
  }

  if (!items || items.length === 0) {
    return <p>No items in cart.</p>
  }

  const totalProducts = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  // Calculăm numărul total de produse din coș
const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const delivery = 20.00
  const sales = totalProducts * 0.3 
  const total = totalProducts + delivery + sales

  const handleCheckout = () => {
    router.push('/checkout') 
  }

  const togglePromoInput = () => {
    setShowPromoInput(!showPromoInput)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="container md:mx-auto md:p-5 px-0 bg-[#F9F9F9]">
      {isMobile ? (
         <div className="flex flex-col gap-4 max-w-lg mx-auto">
         <div className='flex items-center justify-between bg-white px-5 h-[56px]'>
           <h1 className="font-Heebo-20-semi text-[#1E1E1E]">Bag</h1>
           <Link href="/"><p className='underline'>Back to shop</p></Link>
         </div>
       
         {/* Scrollable area for cart products */}
         <div className="overflow-y-auto max-h-[400px]">
           {items.map((item, index) => (
             <div key={item.id} className={`flex items-center bg-transparent py-5 ${
               items.length > 1 && index !== items.length - 1 ? 'border-b' : ''}`}
               style={{ borderColor: '#E8E8ED', marginLeft: '20px', marginRight: '20px' }}
             >
               <Link href={PUBLIC_URL.product(item.product.id)} className="flex-shrink-0">
                 <Image src={item.product.images[0]} alt={item.product.title} width={80} height={80} className="object-cover rounded-md" />
               </Link>
               <div className="ml-[10px] space-y-6 w-full">
                 <div className='flex items-center justify-between'>
                   <h2 className="font-Heebo-15 text-[#1E1E1E] truncate-2-lines">{item.product.title}</h2>
                   <FavoriteButton product={item.product} />
                 </div>
                 <div>
                  <div className='flex gap-[5px]'>
                    <h2 className="font-Heebo-16 text-[#8C8C8C] truncate-2-lines cursor-pointer" onClick={() => toggleColorDropdown(item.id)}>
                      {selectedColors[item.id] || item.product.color.name}
                    </h2>
                    <Image
                      src='/images/arr.svg'
                      alt='arr'
                      width={12}
                      height={10}
                      className={`text-[#8C8C8C] transition-transform duration-300 ${
                        colorDropdownOpen[item.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {colorDropdownOpen[item.id] && (
                    <div className="absolute bg-white shadow-lg border mt-1">
                      {availableColors.map((color) => (
                        <div
                          key={color}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => selectColor(item.id, color)}
                        >
                          {color}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                 <div className='font-Heebo-14-med flex items-center justify-between h-[20px]'>
                   <p className='text-[#5D5D5D]'>${item.product.price}</p>
                   <CartActions item={item} />
                 </div>
               </div>
             </div>
           ))}
         </div>
       
         {/* Remaining code unchanged */}
         <div className="">
           <div className='bg-white p-5'>
           <div className='flex items-center justify-between'>
             <h2 className="font-Heebo-20-semi text-[#1E1E1E]">Summary</h2>
             <p>{totalItems} {totalItems === 1 ? 'item' : 'items'}</p> {/* Display item or items based on count */}
            </div>
           <div className="border-t border-[#E8E8ED] pt-4 mt-4">
             <div className="flex justify-between items-center text-sm cursor-pointer mb-4" onClick={togglePromoInput}>
               <p className='font-Heebo-16-semi text-[#1E1E1E]'>Do you have Promo Code?</p>
               <span className={showPromoInput ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                 <Image src='/images/arr.svg' alt='arrow' width={16} height={16} />
               </span>
             </div>
             {showPromoInput && (
               <div className="relative mb-5">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Send your promo code"
                  className="w-full p-2 pr-[60px] border border-transparent rounded-md text-[#6F6F6F] bg-[#F9F9F9] h-[40px]"
                />
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[116px] bg-[#FFFFFF] px-3 py-2 rounded-md text-sm text-[#424242] font-Heebo-13 h-[30px]"
                >
                  Apply
                </button>
              </div>
             )}
           </div>
           <div className="text-sm text-gray-700 space-y-2">
             <div className='flex flex-col border-y border-[#E8E8ED]'>
               <div className="flex justify-between text-sm mt-5 font-Heebo-16 mb-[10px]">
                 <p className='text-[#1E1E1E]'>Subtotal</p>
                 <p className='text-[#5D5D5D]'>{formatPrice(totalProducts)}</p>
               </div>
               <div className="flex justify-between text-sm mb-[10px] font-Heebo-16">
                 <p className='text-[#1E1E1E]'>Shipping</p>
                 <p className='text-[#5D5D5D]'>FREE</p>
               </div>
               <div className="flex justify-between text-sm mb-5 font-Heebo-16">
                 <p className='text-[#1E1E1E]'>Estimated Tax</p>
                 <p className='text-[#5D5D5D]'>{formatPrice(sales)}</p>
               </div>
             </div>
           </div>
           </div>
           <div className='px-5'>
            <div className="flex justify-between font-Heebo-16-semi py-5">
                <p>Total</p>
                <p>{formatPrice(total)}</p>
              </div>
            <button className="w-full py-3 mb-5 text-[#1E1E1E] border border-[#1E1E1E] rounded-lg font-Heebo-16-semi h-[56px]" onClick={handleCheckout}>
              Checkout
            </button>
            <button className="w-full py-3 mb-6 text-white rounded-lg bg-black h-[56px]">
              <span className="flex justify-center items-center">
                <Image src="/images/applepay.svg" alt="applepay" width={54} height={20} />
              </span>
            </button>
            </div>
         </div>
         <div className='px-5'>
           <div className="border-y-[0.1px] border-[#5D5D5D]">
             {/* Easy Returns section */}
             <div className="flex justify-between items-center text-sm cursor-pointer py-5 border-b-[0.5px] border-[#5D5D5D]" onClick={() => toggleSection('easyReturns')}>
               <div className='flex gap-[10px] items-center '>
                 <Image src='/images/easy.svg' alt='easy' width={16} height={16} />
                 <p className='font-Heebo-16 text-[#1E1E1E]'>EASY RETURNS</p>
               </div>
               <span className={expandedSections.easyReturns ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                 <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
               </span>
             </div>
             {expandedSections.easyReturns && <p className="text-sm text-gray-500 border-b-[0.5px] border-[#5D5D5D] py-4">Details about easy returns.</p>}
             
             {/* Other sections remain unchanged */}
             {/* Secure Payment section */}
             <div className="flex justify-between items-center text-sm cursor-pointer py-5 border-b-[0.5px] border-[#5D5D5D]" onClick={() => toggleSection('securePayment')}>
               <div className='flex gap-[10px] items-center '>
                 <Image src='/images/secure.svg' alt='secure' width={16} height={16} />
                 <p className='font-Heebo-16 text-[#1E1E1E]'>SECURE PAYMENT</p>
               </div>
               <span className={expandedSections.securePayment ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                 <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
               </span>
             </div>
             {expandedSections.securePayment && <p className="text-sm text-gray-500 border-b-[0.5px] border-[#5D5D5D] py-4">Information about secure payments.</p>}
             
             {/* Payment Options section */}
             <div className="flex justify-between items-center text-sm cursor-pointer py-5" onClick={() => toggleSection('youCanPayBy')}>
               <div className='flex gap-[10px] items-center '>
                 <Image src='/images/pay.svg' alt='pay' width={20} height={16} />
                 <p className='font-Heebo-16 text-[#1E1E1E]'>YOU CAN PAY BY</p>
               </div>
               <span className={expandedSections.youCanPayBy ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                 <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
               </span>
             </div>
             {expandedSections.youCanPayBy && <p className="text-sm text-gray-500 py-4">Accepted payment methods.</p>}
           </div>
         </div>
       </div>
       
      ) : (
        // --- Versiunea Desktop ---
        <div className="max-w-[1100px] flex flex-wrap gap-20">
          <div className="flex-1 space-y-5 max-w-[520px] w-full">
            <h1 className='font-Heebo-24-- text-[#000000]'>Bag</h1>
            {items.map((item, index) => (
              <div
                className={`max-w-[520px] w-full ${index < items.length - 1 ? 'border-b' : ''}`}
                key={item.id}
                style={{ borderColor: '#E0E0E0', paddingBottom: index < items.length - 1 ? '20px' : '0' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-between w-full">
                    <div className='flex items-center justify-center h-[140px] w-[140px] bg-[#FFFFFF]'>
                      <Link href={PUBLIC_URL.product(item.product.id)} className="relative h-[126px] w-[126px] rounded-md overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    <div className="ml-[10px] space-y-6 w-full">
                      <div className='flex items-center justify-between'>
                        <h2 className="font-Heebo-18 text-[#1E1E1E] truncate-2-lines">{item.product.title}</h2>
                        <FavoriteButton product={item.product} />
                      </div>
                      <div>
                        <div className='flex gap-[5px]'>
                          <h2 className="font-Heebo-16 text-[#8C8C8C] truncate-2-lines cursor-pointer" onClick={() => toggleColorDropdown(item.id)}>
                            {selectedColors[item.id] || item.product.color.name}
                          </h2>
                          <Image
                            src='/images/arr.svg'
                            alt='arr'
                            width={12}
                            height={10}
                            className={`text-[#8C8C8C] transition-transform duration-300 ${
                              colorDropdownOpen[item.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </div>

                        {colorDropdownOpen[item.id] && (
                          <div className="absolute bg-white shadow-lg border mt-1">
                            {availableColors.map((color) => (
                              <div
                                key={color}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => selectColor(item.id, color)}
                              >
                                {color}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className='font-Heebo-16-med flex items-center justify-between h-[20px]'>
                        <p className='text-[#5D5D5D]'>${item.product.price}</p>
                        <CartActions item={item} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 max-w-[400px] w-full">
            <div>
              <h2 className="font-Heebo-24-- mb-5 text-[#1E1E1E]">Summary</h2>
              <div className="bg-white rounded-lg pt-5 px-5 mb-5">
                <div
                  className="flex justify-between items-center text-sm mb-4 cursor-pointer rounded-lg"
                  onClick={togglePromoInput}
                >
                  <p className='font-Heebo-16-semi'>Do you have Promo Code?</p>
                  <span className={showPromoInput ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                    <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
                  </span>
                </div>
                {showPromoInput && (
                  <div className="relative mb-5">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Send your promo code"
                    className="w-full p-4 pr-[60px] border border-transparent rounded-md text-[#6F6F6F] bg-[#F9F9F9] h-[40px]"
                  />
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[116px] bg-[#FFFFFF] px-3 py-2 rounded-md text-sm text-[#424242] font-Heebo-13 h-[30px]"
                  >
                    Apply
                  </button>
                </div>
                )}
                <div className='flex flex-col border-y border-[#E8E8ED]'>
                  <div className="flex justify-between text-sm mt-5 font-Heebo-16 mb-[10px]">
                    <p className='text-[#1E1E1E]'>Subtotal</p>
                    <p className='text-[#5D5D5D]'>{formatPrice(totalProducts)}</p>
                  </div>
                  <div className="flex justify-between text-sm mb-[10px] font-Heebo-16">
                    <p className='text-[#1E1E1E]'>Shipping</p>
                    <p className='text-[#5D5D5D]'>FREE</p>
                  </div>
                  <div className="flex justify-between text-sm mb-5 font-Heebo-16">
                    <p className='text-[#1E1E1E]'>Estimated Tax</p>
                    <p className='text-[#5D5D5D]'>{formatPrice(sales)}</p>
                  </div>
                </div>
                <div className="flex justify-between font-Heebo-16-semi py-5 text-[#1E1E1E]">
                  <p>Total</p>
                  <p>{formatPrice(total)}</p>
                </div>
              </div>
              <button
                className="w-full py-3 mb-5 text-black border border-[#1E1E1E] rounded-lg font-Heebo-16-semi h-[56px]"
                onClick={handleCheckout}
              >
                Checkout
              </button>
              <button className="w-full py-3 mb-6 text-white rounded-lg bg-black h-[56px]">
                <span className="flex justify-center items-center">
                  <Image src="/images/applepay.svg" alt="applypay" width={54} height={20}/>
                </span>
              </button>
            </div>
            <div className="border-y-[0.5px] border-[#5D5D5D]">
              <div
                className="flex justify-between items-center text-sm cursor-pointer py-5 border-b-[0.5px] border-[#5D5D5D]"
                onClick={() => toggleSection('easyReturns')}
              >
                <div className='flex gap-[10px] items-center '>
                  <Image src='/images/easy.svg' alt='easy' width={16} height={16} />
                  <p className='font-Heebo-16 text-[#1E1E1E]'>EASY RETURNS</p>
                </div>
                <span className={expandedSections.easyReturns ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                  <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
                </span>
              </div>
              {expandedSections.easyReturns && <p className="text-sm text-gray-500 border-b-[0.5px] border-[#5D5D5D] py-4">Details about easy returns.</p>}

              <div
                className="flex justify-between items-center text-sm cursor-pointer py-5 border-b-[0.5px] border-[#5D5D5D]"
                onClick={() => toggleSection('securePayment')}
              >
                <div className='flex gap-[10px] items-center '>
                  <Image src='/images/secure.svg' alt='secure' width={16} height={16} />
                  <p className='font-Heebo-16 text-[#1E1E1E]'>SECURE PAYMENT</p>
                </div>
                <span className={expandedSections.securePayment ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                  <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
                </span>
              </div>
              {expandedSections.securePayment && <p className="text-sm text-gray-500 border-b-[0.5px] border-[#5D5D5D] py-4">Information about secure payments.</p>}
              <div
                className="flex justify-between items-center text-sm cursor-pointer py-5"
                onClick={() => toggleSection('youCanPayBy')}
              >
                <div className='flex gap-[10px] items-center '>
                  <Image src='/images/pay.svg' alt='pay' width={20} height={16} />
                  <p className='font-Heebo-16 text-[#1E1E1E]'>YOU CAN PAY BY</p>
                </div>
                <span className={expandedSections.youCanPayBy ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
                  <Image src='/images/arr.svg' alt='arr' width={16} height={16} />
                </span>
              </div>
              {expandedSections.youCanPayBy && <p className="text-sm text-gray-500 py-4">Accepted payment methods.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
