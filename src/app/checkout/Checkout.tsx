'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/main-layout/header/Header';
import { CheckoutCart } from '../../../src/components/layouts/main-layout/header/header-menu/header-cart/CheckoutCart';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';
import { CountrySelect } from './components/CountrySelect'; // Importăm componenta CountrySelect
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js'; // Validarea numerelor de telefon
import Image from 'next/image'; // Pentru logo-urile PayPal, Apple Pay etc.
import Order from '../../components/layouts/main-layout/header/header-menu/header-cart/cart-item/components/order/Order';
import CheckoutPage from '@/components/layouts/main-layout/header/header-menu/header-cart/cart-item/components/order/StripePaymentButton';
import PayPalButton from '@/components/layouts/main-layout/header/header-menu/header-cart/cart-item/PayPalButton';
import { InfoHeader } from '@/components/layouts/main-layout/header/InfoHeader';
import { CheckoutCartHeader } from '@/components/layouts/main-layout/header/header-menu/header-cart/CheckoutCartHeader';
import { clsx } from 'clsx';
import FooterCheckout from './components/FooterCheckout';
import FloatingLabelInput from './components/FloatingLabelInput';

interface ShippingData {
  company: string;
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
    company: '',
    firstName: '',
    lastName: '',
    country: 'MD', // Cod implicit pentru țară
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    company: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    email: '',
    phone: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Stare pentru a gestiona trimiterea formularului
  const [isEditing, setIsEditing] = useState(false); // Stare pentru a gestiona editarea datelor
  const [isExpressCheckoutVisible, setExpressCheckoutVisible] = useState(true); // Gestionarea vizibilității secțiunii Express Checkout
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [focused, setFocused] = useState(false);



  const [showCompanyInput, setShowCompanyInput] = useState(false);

  const handleToggleCompanyInput = () => {
    setShowCompanyInput(!showCompanyInput);
  };

  const fetchCountryFromZip = async (zip: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (!response.ok) {
        throw new Error('Invalid ZIP code or no data found.');
      }
      const data = await response.json();
      return data.country_abbreviation;
    } catch (error) {
      console.error('Error fetching country from ZIP code:', error);
      return null;
    }
  };

  const validatePhoneNumber = (phone: string, country: string) => {
    const countryCode = country.toUpperCase() as CountryCode;
    try {
      const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
      return phoneNumber?.isValid() || false;
    } catch (error) {
      return false;
    }
  };

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'city':
      case 'country':
        return value.length > 0;
      case 'zip':
        return value.length >= 4;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      case 'phone':
        return validatePhoneNumber(value, shippingData.country); 
      default:
        return true;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setShippingData({
      ...shippingData,
      [name]: value,
    });

    const isValid = validateInput(name, value);
    setErrors({
      ...errors,
      [name]: isValid ? '' : `${name} is not valid`,
    });

    if (name === 'zip') {
      const countryAbbreviation = await fetchCountryFromZip(value);
      if (countryAbbreviation) {
        setShippingData((prevData) => ({
          ...prevData,
          country: countryAbbreviation,
        }));
      }
    }
  };

  const handleCountryChange = (country: string) => {
    setShippingData({
      ...shippingData,
      country,
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

    // Verifică dacă formularul este valid
    if (!isFormValid) return;

    // Extrage produsele din coș
    const products = items.map((item) => ({
        name: item.product,
        quantity: item.quantity,
        price: item.price,
    }));

    // Construiește datele pentru email
    const emailData = {
        email: shippingData.email,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        products, // Adaugă produsele la payload
    };

    try {
        // Trimite datele către backend pentru a procesa emailul
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        });

        const data = await response.json();

        // Verifică dacă răspunsul este corect
        if (!response.ok) {
            console.error('Failed to send email:', data);
            return;
        }

        console.log('Email sent successfully:', data);
    } catch (error) {
        console.error('Error while sending email:', error);
        return; // Oprește execuția dacă există o eroare
    }

    // Setează stările pentru a indica faptul că formularul a fost trimis și că secțiunea de plată trebuie afișată
    setIsSubmitted(true);
    setIsEditing(false);
    setIsPaymentVisible(true); // Setează starea pentru a afișa secțiunea de plată
};

  
  
  

  //Total:
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.2; // De exemplu, 20% taxe
  const totalAmount = subtotal + subtotal * taxRate; // Calcul total cu taxe

  
  const getInputStyles = (error: string) => {
    return `border ${error ? 'border-red-500 bg-red-100 text-red-500 placeholder-red-500' : 'border-[#6F6F6F]'} focus:bg-blue-100 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSubmitted(false); 
  };
  if (isSubmitted && !isEditing) {
    return (
      <div className='md:h-[2000px] h-[1600px] bg-[#F9F9F9]'>
        <div className='bg-[#F9F9F9]'>
        <div className='md:block hidden'>
          <InfoHeader />  
        </div> 
        <div className="w-full lg:w-1/3 md:p-4 md:hidden block p-0 m-0">
              <CheckoutCartHeader />
        </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-5 sm:px-6 lg:px-0 bg-[#F9F9F9]">
        <div className="w-full max-w-[620px] flex flex-col gap-10 justify-center items-center py-4 sm:p10 mb-6 lg:mb-0">
          <div className="w-full max-w-[520px]">
            <div className="mb-4">
              <h2 className="font-Heebo-24-- mb-5 text-[#1E1E1E]">When will your order arrive?</h2>
              <div className="flex items-center justify-between border border-[#1E1E1E] p-5 rounded-[10px] mb-5 h-[56px]">
                <h3 className="text-[#1E1E1E] font-Heebo-16">Arrives Wed, Oct 22 - Oct 29</h3>
                <p className="text-[#8C8C8C] font-heebo font-medium text-[14px] leading-[14px]">FREE</p>
              </div>
            </div>
            <div className="w-full lg:w-full md:p-4 md:hidden block border-b">
              <div className="py-5 text-[14px] font-heebo">
                <h1 className="text-[14px] font-Heebo-16 mb-[5px]">Keep in mind:</h1>
                <ul className="list-disc pl-4">
                  <li className="mb-2 font-Heebo-reg-14">
                    <span className='font-Heebo-14-bolt'>Signature: </span>You may need to sign for your delivery.
                  </li>
                  <li className="font-Heebo-reg-14">
                    <span className='font-Heebo-14-bolt'>Change delivery: </span>
                    Once shipped, you can track and adjust where your package is delivered (pickup, secure location, or contactless)
                  </li>
                </ul>
              </div>
            </div>

            {isExpressCheckoutVisible && (
              <>
                <div className="flex flex-col gap-5 mb-6">
                  <div className="flex gap-5 md:h-[56px] h-10">
                    <button className="w-full py-2 border rounded-[10px] bg-[#00457C] flex items-center justify-center">
                      <Image src='/images/paypal.svg' alt='PayPal' width={69} height={18} className='md:w-[69px] md:h-[18px] w-[48px] h-[13px]' />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] bg-[#000000] flex items-center justify-center">
                      <Image src='/images/applepay.svg' alt='Apple Pay' width={54} height={20} className='md:w-[54px] md:h-[20px] w-[42px] h-[16px]' />
                      <CheckoutPage />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] bg-[#333E48] flex items-center justify-center">
                      <Image src='/images/amazonpay.svg' alt='Amazon Pay' width={102} height={20} className='mt-1 md:w-[102px] md:h-[20px] w-[81px] h-[15px]' />
                      <CheckoutPage />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-10">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 font-Heebo-16 text-[#424242]">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </>
            )}

            <div className="mt-6 flex justify-between items-center mb-10">
              <h2 className="font-Heebo-bold-20">Shipping Address</h2>
              <button className="text-[#8C8C8C] font-semibold font-heebo text-[16px] underline" onClick={handleEdit}>Edit</button>
            </div>
            <div className='text-[#8C8C8C] font-Heebo-reg-16-0'>
              <p className='font-Heebo-16 text-[#8C8C8C]'>{shippingData.firstName} {shippingData.lastName}</p>
              <p>{shippingData.address}, {shippingData.city}, {shippingData.country}, {shippingData.zip}</p>
              <p className='mt-5'>{shippingData.email}</p>
              {shippingData.company && (
                <p>{shippingData.company}</p>
              )}
              <p>{shippingData.phone}</p>
              <p className='border-t border-[#BDBDBD] mt-10 mb-5 h-[1px]'></p>
            </div>
            {isPaymentVisible && (
              <Order items={items} />
            )}
          </div>
          {/* <Order items={items} /> */}
        </div>
        <div className="w-full lg:w-1/3 md:p-4 md:block hidden">
          {/* <CheckoutCart /> */}
          <div className="p-4 text-[14px] font-heebo leading-[14px]">
            <h1 className="font-Heebo-16 mb-[5px] text-[#1E1E1E]">Keep in mind:</h1>
            <ul className="list-disc pl-4 text-[#6F6F6F]">
              <li className="mb-2 font-Heebo-reg-14"><span className='font-Heebo-14-bolt text-[#1E1E1E]'>Signature: </span>You may need to sign for your delivery.</li>
              <li className="max-w-[437px] w-full font-Heebo-reg-14"> <span className='font-Heebo-14-bolt text-[#1E1E1E]'>Change delivery: </span>
                Once shipped, you can track and adjust where your package is delivered (pickup, secure location, or contactless)
              </li>
            </ul>
          </div>
          {/* <div className='space-y-[48px] leading-[14px]'>
            <div className='text-[14px] font-heebo text-[#6F6F6F] md:mt-[565px]'>
              <p>We’ll email you a receipt and send order updates to your mobile phone via SMS or iMessage.</p>
            </div>
            <div className='text-[14px] font-heebo text-[#6F6F6F]'>
              <p>The phone number you enter can't be changed after you place your order, so please make sure it's correct.</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    <FooterCheckout/>
      </div>
    );
  }

  return (
    <div>
      <div className='bg-[#F9F9F9] md:h-[1200px] h-[1600px]'>
      <div className='md:block hidden'>
        <InfoHeader />  
      </div> 
      <div className="w-full lg:w-1/3 md:p-4 md:hidden block p-0 m-0">
            <CheckoutCartHeader />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-5 sm:px-6 lg:px-0 bg-[#F9F9F9]">
        <div className="w-full max-w-[620px] flex flex-col gap-10 justify-center items-center py-4 sm:p-10 mb-6 lg:mb-0">
          <div className="w-full max-w-[520px]">
            <div className="mb-4">
              <h2 className="font-Heebo-24-- mb-5 text-[#1E1E1E] md:block hidden">When will your order arrive?</h2>
              <h2 className="font-Heebo-18 mb-5 text-[#1E1E1E] md:hidden">When will your order arrive?</h2>
              <div className="flex items-center justify-between border border-[#1E1E1E] p-5 rounded-[10px] md:mb-10 mb-5 h-[56px]">
                <h3 className="text-[#1E1E1E] font-Heebo-16 ">Arrives Wed, Oct 22 - Oct 29</h3>
                <p className="text-[#8C8C8C] font-heebo font-medium text-[14px] leading-[14px]">FREE</p>
              </div>
            </div>

            <div className="w-full lg:w-1/3 md:p-4 pb-10 md:hidden block border-b">
              {/* <CheckoutCart /> */}
              <div className="md:py-5 text-[14px] font-heebo">
                <h1 className="text-[14px] md:font-Heebo-16 font-Heebo-14 mb-[5px]">Keep in mind:</h1>
                <ul className="list-disc pl-4">
                  <li className="md:mb-2 mb-[5px] md:font-Heebo-reg-14 font-Heebo-reg-12"><span className='font-Heebo-14-bolt'>Signature: </span>You may need to sign for your delivery.</li>
                  <li className="max-w-[437px] w-full md:font-Heebo-reg-14 font-Heebo-reg-12"> <span className='font-Heebo-14-bolt'>Change delivery: </span>
                    Once shipped, you can track and adjust where your package is delivered (pickup, secure location, or contactless)
                  </li>
                </ul>
              </div>
            </div>

            {/* //Input Date */}
            <button
              className="w-full text-left pb-5 font-Heebo-24-- text-[#1e1e1e] md:mt-0 mt-10 md:block hidden"
            >
              Want to check out faster? {isExpressCheckoutVisible ? '' : ''}
            </button>
            <button
              className="w-full text-left pb-5 font-Heebo-18 text-[#1e1e1e] md:mt-0 mt-10 md:hidden"
            >
              Want to check out faster? {isExpressCheckoutVisible ? '' : ''}
            </button>
            {isExpressCheckoutVisible && (
             <>
                <div className="flex flex-col gap-5 mb-6">
                  <div className="flex gap-5 md:h-[56px] h-10">
                    <button className="w-full py-2 border rounded-[10px] bg-[#00457C] flex items-center justify-center">
                      <Image src='/images/paypal.svg' alt='PayPal' width={69} height={18} className='md:w-[69px] md:h-[18px] w-[48px] h-[13px]' />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] bg-[#000000] flex items-center justify-center">
                      <Image src='/images/applepay.svg' alt='Apple Pay' width={54} height={20} className='md:w-[54px] md:h-[20px] w-[42px] h-[16px]'/>
                      <CheckoutPage/>
                    </button>
                    <button className="w-full py-2 border rounded-[10px] bg-[#333E48] flex items-center justify-center">
                      <Image src='/images/amazonpay.svg' alt='Amazon Pay' width={102} height={20} className='mt-1 md:w-[102px] md:h-[20px] w-[81px] h-[15px]' />
                      <CheckoutPage/>
                    </button>
                  </div>
                  <p className='font-Heebo-reg-12 md:hidden block'>Complete your purchase in just one click with <span className='font-Heebo-bold-12'>Express Checkout</span>.</p>
                </div>
                <div className="flex items-center justify-between md:mt-5 mt-10">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 font-Heebo-16 text-[#424242]">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </>
            )}

            <h2 className="font-Heebo-24-- mb-5 text-[#1E1E1E] mt-[40px] md:block hidden">Where should we send your order?</h2>
            <h2 className="font-Heebo-18 mb-5 text-[#1E1E1E] mt-[40px] md:hidden block">When will your order arrive?</h2>
            <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-5">
              {/* First Name and Last Name Fields */}
              <div className="flex md:gap-5 gap-[10px] md:h-[56px] max-w-[520px] md:flex-row flex-col">
                  <div className="w-full md:h-full h-[56px]">
                      <FloatingLabelInput
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={shippingData.firstName}
                          onChange={handleChange}
                          placeholder="First Name"
                          error={errors.firstName}
                          required
                          getInputStyles={getInputStyles}
                      />
                      {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.firstName}</p> // Increased mb-6 for spacing
                      )}
                  </div>
                  <div className="w-full md:h-full h-[56px]">
                      <FloatingLabelInput
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={shippingData.lastName}
                          onChange={handleChange}
                          placeholder="Last Name"
                          error={errors.lastName}
                          required
                          getInputStyles={getInputStyles}
                      />
                      {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.lastName}</p> // Increased mb-6 for spacing
                      )}
                  </div>
              </div>

              {/* Company Field (conditionally shown) */}
              {showCompanyInput && (
                  <div className="w-full">
                      <FloatingLabelInput
                          type="text"
                          id="company"
                          name="company"
                          value={shippingData.company}
                          onChange={handleChange}
                          placeholder="Company Name (optional)"
                          error={errors.company}
                          required
                          getInputStyles={getInputStyles}
                      />
                      {errors.company && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.company}</p> // Increased mb-6 for spacing
                      )}
                  </div>
              )}
              {/* Company Field (conditionally shown) */}
              {showCompanyInput && (
                  <div className="w-full">
                      <FloatingLabelInput
                          type="text"
                          id="company"
                          name="company"
                          value={shippingData.company}
                          onChange={handleChange}
                          placeholder="Company Name (optional)"
                          error={errors.company}
                          required
                          getInputStyles={getInputStyles}
                      />
                      {errors.company && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.company}</p> // Increased mb-6 for spacing
                      )}
                  </div>
              )}

              {/* Address Field */}
              <div className="w-full">
                  <FloatingLabelInput
                      type="text"
                      id="address"
                      name="address"
                      value={shippingData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      error={errors.address}
                      required
                      getInputStyles={getInputStyles}
                  />
                  {errors.address && (
                      <p className="text-red-500 text-sm mt-1 mb-6">{errors.address}</p> // Increased mb-6 for spacing
                  )}
              </div>

              {/* City, Country, and Zip Code Fields */}
              <div className="flex md:gap-[20px] gap-[10px] md:h-[56px] max-w-[520px] flex-col sm:flex-row">
                  <div className="w-full md:h-full h-[56px]">
                      <FloatingLabelInput
                        type="text"
                        id="city"
                        name="city"
                        value={shippingData.city}
                        onChange={handleChange}
                        placeholder="City/Town"
                        error={errors.city}
                        required
                        getInputStyles={getInputStyles}
                      />
                      {errors.city && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.city}</p> // Increased mb-6 for spacing
                      )}
                  </div>

                  {/* Country Select */}
                  <div className={`w-full h-[56px] flex items-center py-2 rounded-[10px] text-[14px] font-heebo placeholder-[#6F6F6F]  ${getInputStyles(errors.country)}`}>
                    <CountrySelect
                      selectedCountry={shippingData.country}
                      onCountryChange={handleCountryChange}
                    />
                  </div>
                   
                  <div className="w-full md:h-full h-[56px]">
                      <FloatingLabelInput
                          type="text"
                          id="zip"
                          name="zip"
                          value={shippingData.zip}
                          onChange={handleChange}
                          placeholder="Zip code"
                          error={errors.zip}
                          required
                          getInputStyles={getInputStyles}
                      />
                      {errors.zip && (
                          <p className="text-red-500 text-sm mt-1 mb-6">{errors.zip}</p> // Increased mb-6 for spacing
                      )}
                  </div>
              </div>


              <div className="flex items-center cursor-pointer text-[#6F6F6F] text-[14px] font-heebo md:block hidden mt-0" onClick={handleToggleCompanyInput}>
                  {!showCompanyInput && (
                    <div className='flex items-center relative'>
                      <span className="mr-1">+</span>
                      <span>Add Company Name</span>
                      <span
                        className="ml-2 cursor-pointer relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <Image src="/images/question-icon.svg" alt="info" width={22} height={22} className='' />
                        {showTooltip && (
                          <div className="absolute bg-gray-100 text-gray-700 text-sm p-3 rounded-[10px] shadow-lg w-[250px] -left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-50 font-Heebo-reg-12">
                            The sales tax listed on the checkout page is only an estimate. Your invoice will contain the final sales tax, including state and local taxes, as well as any applicable rebates or fees. 
                          </div>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {showCompanyInput && (
                  <div className="mb-5 max-w-[520px] w-full md:block hidden">
                    <FloatingLabelInput
                      type="text"
                      id="company"
                      name="company"
                      value={shippingData.company || ''}
                      onChange={handleChange}
                      placeholder="Company Name (optional)"
                      error={errors.company}
                      required
                      getInputStyles={getInputStyles}
                    />
                  </div>
                )}

                <div className="flex items-center cursor-pointer text-[#6F6F6F] text-[14px] font-heebo md:hidden block md:mb-0" onClick={handleToggleCompanyInput}>
                  {!showCompanyInput && (
                    <div className='flex items-center relative mt-[10px]'>
                      <span className="mr-2">+</span>
                      <span>Add Company Name</span>
                      <span
                        className="ml-2 cursor-pointer relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <Image src="/images/question-icon.svg" alt="info" width={18} height={18} className='' />
                        {showTooltip && (
                          <div className="absolute bg-gray-100 text-gray-700 text-sm p-3 rounded-[10px] shadow-lg w-[250px] -left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-50">
                            The sales tax listed on the checkout page is only an estimate. Your invoice will contain the final sales tax, including state and local taxes, as well as any applicable rebates or fees.
                          </div>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {showCompanyInput && (
                  <div className="mb-5 max-w-[511px] w-full md:hidden block">
                    <FloatingLabelInput
                      type="text"
                      id="company"
                      name="company"
                      value={shippingData.company || ''}
                      onChange={handleChange}
                      placeholder="Company Name (optional)"
                      error={errors.company}
                      required
                      getInputStyles={getInputStyles}
                    />
                  </div>
                )}

                <h2 className="font-Heebo-24-- text-[#1E1E1E] md:pt-5 pt-[30px] md:block hidden">How can we reach you?</h2>
                <h2 className="font-Heebo-18 text-[#1E1E1E] md:pt-5 pt-[30px] md:hidden">How can we reach you?</h2>
                <FloatingLabelInput
                  type="email"
                  id="email"
                  name="email"
                  value={shippingData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  error={errors.email}
                  required
                  getInputStyles={getInputStyles}
                />
                <div className='text-[14px] font-heebo text-[#1E1E1E] md:mt-[520px] md:hidden font-Heebo-reg-12'>
                  <p className='mb-5'>We’ll send your receipt and updates by email.</p>
                </div>

                <FloatingLabelInput
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  error={errors.phone}
                  required
                  getInputStyles={getInputStyles}
                />
                <div className='text-[14px] font-heebo text-[#1E1E1E] md:hidden font-Heebo-reg-12 '>
                  <p className='mb-[30px]'>Make sure your phone number is correct. It can’t be changed.</p>
                </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  className={`bg-[#E5E5E5] py-2 h-[56px] rounded-[10px] w-full font-Heebo-16 text-[#9E9EA0] ${isFormValid ? 'bg-black text-white' : 'opacity-50 cursor-not-allowed text-white'}`}
                  disabled={!isFormValid}
              >
                  Continue to Payment
              </button>
          </form>

          <div className='mt-10'>
            <p className='border-b border-[#BDBDBD] '></p>
            <h1 className='font-Heebo-24-- text-[#BDBDBD] mt-5'>Payment</h1>
          </div>
         </div>

          {/* <Order items={items} /> */}
        </div>
        <div className="w-full lg:w-1/3 md:py-10 md:ml-10 md:mr-[35px] md:block hidden">
          {/* <CheckoutCart /> */}
          <div className=" text-[14px] font-heebo leading-[14px]">
            <h1 className="font-Heebo-16 mb-[5px] text-[#1E1E1E]">Keep in mind:</h1>
            <ul className="list-disc pl-4 text-[#6F6F6F]">
              <li className="mb-2 font-Heebo-reg-14"><span className='font-Heebo-14-bolt text-[#1E1E1E]'>Signature: </span>You may need to sign for your delivery.</li>
              <li className="max-w-[437px] w-full font-Heebo-reg-14"> <span className='font-Heebo-14-bolt text-[#1E1E1E]'>Change delivery: </span>
                Once shipped, you can track and adjust where your package is delivered (pickup, secure location, or contactless)
              </li>
            </ul>
          </div>
          <div className='mt-[120px] w-full'>
            <p className='max-w-[520px] w-full font-Heebo-reg-14'>Complete your purchase in just one click with <span className='font-Heebo-14 text-[#1E1E1E] w-full'>Express Checkout.</span></p>
          </div>
          <div className='space-y-[58px] leading-[14px]'>
            <div className='text-[14px] font-heebo text-[#1E1E1E] md:mt-[500px]'>
              <p>We’ll send your receipt and updates by email.</p>
            </div>
            <div className='text-[14px] font-heebo text-[#1E1E1E]'>
              <p>Make sure your phone number is correct. It can’t be changed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      <FooterCheckout/>
    </div>
    
  );
}
