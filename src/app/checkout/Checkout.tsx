'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/main-layout/header/Header';
import { CheckoutCart } from '../../../src/components/layouts/main-layout/header/header-menu/header-cart/CheckoutCart';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';

interface ShippingData {
  firstName: string;
  lastName: string;
  country: string;
  address: string;
  city: string;
  zip: string;
  email: string;
  phone: string;
}

export function Checkout() {
  const { user } = useProfile();
  const { items } = useCart();
  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  // Setăm starea initială la "true" pentru a deschide secțiunea Express Checkout
  const [isExpressCheckoutVisible, setExpressCheckoutVisible] = useState(true);
  const [isPaymentVisible, setPaymentVisible] = useState(false);
  const [isOrderReviewVisible, setOrderReviewVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const { firstName, lastName, country, address, city, zip, email, phone } = shippingData;
    if (firstName && lastName && country && address && city && zip && email && phone) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [shippingData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...shippingData,
          items,
        }),
      });
      if (response.ok) {
        router.push('/checkout/review');
      } else {
        console.error('Failed to submit the data');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="my-6">
      <Header />
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-4 sm:px-6 lg:px-0">
        {/* Secțiunea stângă */}
        <div className="w-full max-w-[620px] flex justify-center items-center md:p-4 sm:p-6 pt-0 mb-6 lg:mb-0">
          <div className="w-full max-w-[511px]">
            {/* Express Checkout */}
            <button
              className="w-full text-left pb-4 font-semibold font-heebo text-[20px] text-[#424242]"
              onClick={() => setExpressCheckoutVisible(!isExpressCheckoutVisible)}
            >
              Express Checkout {isExpressCheckoutVisible ? '▲' : '▼'}
            </button>
            {isExpressCheckoutVisible && (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex gap-5">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-md">PayPal</button>
                    <button className="w-full py-2 bg-black text-white rounded-md">Apple Pay</button>
                    <button className="w-full py-2 bg-yellow-500 text-black rounded-md">Amazon Pay</button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-[48px]">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 text-gray-500 text-sm">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                {/* Shipping Details */}
                <h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242] mt-[48px]">Shipping Details</h2>
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-[14px] max-w-[511px] w-full flex-col sm:flex-row">
                    {/* First Name */}
                    <div className="mb-4 w-full sm:w-1/2">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                        placeholder="First Name"
                        required
                      />
                      <label htmlFor="firstName" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                        First Name
                      </label>
                    </div>
                    {/* Last Name */}
                    <div className="mb-4 w-full sm:w-1/2">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                        placeholder="Last Name"
                        required
                      />
                      <label htmlFor="lastName" className="block text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                        Last Name
                      </label>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="mb-4 max-w-[511px] w-full">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                      placeholder="Start typing your street address"
                      required
                    />
                    <label htmlFor="address" className="block text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Street address
                    </label>
                  </div>
                  <div className="flex gap-[14px] max-w-[511px] w-full flex-col sm:flex-row">
                    {/* City */}
                    <div className="mb-4 w-full sm:w-1/2">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                        placeholder="City/Town"
                        required
                      />
                      <label htmlFor="city" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                        City/Town
                      </label>
                    </div>
                    {/* Country */}
                    <div className="mb-4 w-full sm:w-1/2">
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={shippingData.country}
                        onChange={handleChange}
                        className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                        placeholder="Country/Region"
                        required
                      />
                      <label htmlFor="country" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                        Country/Region
                      </label>
                    </div>
                    {/* Zip Code */}
                    <div className="mb-4 w-full sm:w-1/2">
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        value={shippingData.zip}
                        onChange={handleChange}
                        className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                        placeholder="Zip code"
                        required
                      />
                      <label htmlFor="zip" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                        Zip code
                      </label>
                    </div>
                  </div>
                  <div className="mb-4 max-w-[511px] w-full">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                      placeholder="Email"
                      required
                    />
                    <label htmlFor="email" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Email
                    </label>
                  </div>
                  <div className="mb-4 max-w-[511px] w-full">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full h-[48px] px-4 py-2 border border-gray-300 rounded-md text-[14px] font-heebo"
                      placeholder="Phone"
                      required
                    />
                    <label htmlFor="phone" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Phone
                    </label>
                  </div>
                  <button
                    type="submit"
                    className={`bg-gray-700 text-white py-2 rounded-md mt-4 w-full ${isFormValid ? 'hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={!isFormValid} 
                  >
                    Save & Continue
                  </button>
                </form>
              </>
            )}
          </div> 
        </div>
        <div className="w-full lg:w-1/3 md:p-6">
          <CheckoutCart />
        </div>
      </div>
    </div>
  );
}
