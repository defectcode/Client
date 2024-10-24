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
    return `border ${error ? 'border-red-500 bg-red-100 text-red-500 placeholder-red-500' : 'border-gray-300'} focus:bg-blue-100 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSubmitted(false); 
  };
  if (isSubmitted && !isEditing) {
    return (
      <div className="my-3">
        <InfoHeader />
        <div className="w-full lg:w-1/3 md:p-4 md:hidden block">
            <CheckoutCartHeader />
          </div>
        <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-4 sm:px-6 lg:px-0">
          <div className="w-full max-w-[620px] flex flex-col justify-center items-center md:p-4 sm:p-6 pt-0 mb-6 lg:mb-0">
            <div className="w-full max-w-[511px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[20px] font-bold font-heebo">Contact</h3>
                <button className="text-[#8C8C8C] font-semibold font-heebo text-[16px]" onClick={handleEdit}>EDIT</button>
              </div>
              <p className='text-[#1E1E1E] font-heebo text-[14px]'>{shippingData.email}</p>

              <div className="mt-6 flex justify-between items-center">
                <h3 className="text-lg font-bold font-heebo">Address</h3>
                <button className="text-[#8C8C8C] font-semibold font-heebo text-[16px]" onClick={handleEdit}>EDIT</button>
              </div>
              <h2 className="text-[16px] font-semibold font-heebo mb-4 text-[#1E1E1E] mt-10">Delivery address</h2>
              <div className='text-[#8C8C8C] font-heebo text-[16px] gap-[10px]'>
                <p>{shippingData.firstName} {shippingData.lastName}</p>
                <p>{shippingData.address}</p>
                <p>{shippingData.city}, {shippingData.zip}, {shippingData.country}</p>
                <p>{shippingData.phone}</p>
              </div>
            </div>
            {isPaymentVisible && (
              <Order items={items}/>
            )}
            {/* <Order items={items}/> */}
          </div>
          <div className="w-full lg:w-1/3">
            {/* <CheckoutCart /> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <InfoHeader />
      <div className="w-full lg:w-1/3 md:p-4 md:hidden block p-0 m-0">
            <CheckoutCartHeader />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-5 sm:px-6 lg:px-0 md:bg-white bg-[#F9F9F9]">
        <div className="w-full max-w-[620px] flex flex-col gap-10 justify-center items-center py-4 sm:p-6 mb-6 lg:mb-0">
          <div className="w-full max-w-[511px]">
            <div className="mb-4">
              <h2 className="font-Heebo-20 mb-4 text-[#424242]">When will your order arrive?</h2>
              <div className="flex items-center justify-between border border-[#1E1E1E] p-5 rounded-[10px] md:mb-10 mb-5 h-[56px]">
                <h3 className="text-[#1E1E1E] font-Heebo-16 ">Arrives Wed, Oct 22 - Oct 29</h3>
                <p className="text-[#8C8C8C] font-heebo font-medium text-[14px] leading-[14px]">FREE</p>
              </div>
            </div>

            <div className="w-full lg:w-1/3 md:p-4 md:hidden block border-b">
              {/* <CheckoutCart /> */}
              <div className="py-5 text-[14px] font-heebo">
                <h1 className="text-[14px] font-Heebo-16 mb-2">Important to Know About Your Delivery:</h1>
                <ul className="list-disc pl-4">
                  <li className="mb-2 font-Heebo-reg-14"><span className='font-Heebo-14'>Signature Required: </span>The carrier may require a signature upon delivery.</li>
                  <li className="w-[291px] font-Heebo-reg-14"> <span className='font-Heebo-14'>Flexible Delivery Options: </span>
                    Once your order is shipped, you'll be able to track it and adjust the delivery. You can redirect it to a pickup location, hold it at a secure site, or complete a signature waiver for a contactless delivery.
              </li>
                </ul>
              </div>
            </div>

            {/* //Input Date */}
            <button
              className="w-full text-left pb-5 font-Heebo-20 text-[#424242] md:mt-0 mt-10"
            >
              Want to check out faster? {isExpressCheckoutVisible ? '' : ''}
            </button>
            {isExpressCheckoutVisible && (
             <>
                <div className="flex flex-col gap-4 mb-6">
                  {/* <button className="w-full py-2 border rounded-[10px] bg-[#000000] flex items-center justify-center md:h-[56px] h-10 md:hidden block">
                      <Image src='/images/google.svg' alt='googlepay' width={48} height={13} />
                    </button> */}
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
                </div>
                <div className="flex items-center justify-between md:mt-5 mt-10">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 font-Heebo-16 text-[#424242]">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </>
            )}

            <h2 className="font-Heebo-20 mb-5 text-[#424242] mt-[40px]">Where should we send your order?</h2>
            <form onSubmit={handleSubmit} className='md:space-y-5 space-y-[10px]'>
              <div className="flex md:gap-5 gap-[10px] md:h-[56px] max-w-[511px] md:flex-row flex-col">
                <div className="w-full sm:w-1/2">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.firstName)}`}
                    placeholder="First Name"
                    required
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">Please enter a valid First Name</span>
                  )}
                </div>
                <div className="w-full sm:w-1/2">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.lastName)}`}
                    placeholder="Last Name"
                    required
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">Please enter a valid Last Name</span>
                  )}
                </div>
              </div>
              <div className="mb-5 max-w-[511px] w-full">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingData.address}
                  onChange={handleChange}
                  className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.address)}`}
                  placeholder="Start typing your street address"
                  required
                />
                {errors.address && (
                  <span className="text-red-500 text-sm">Please enter a valid address</span>
                )}
              </div>
              <div className="flex md:gap-[14px] gap-[10px] md:h-[56px] max-w-[511px] flex-col sm:flex-row">
                <div className="md:mb-4 w-full sm:w-1/2 h-[56px]">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingData.city}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.city)}`}
                    placeholder="City/Town"
                    required
                  />
                  {errors.city && (
                    <span className="text-red-500 text-sm">Please enter a valid City</span>
                  )}
                </div>
                <div className={`sm:w-1/2 w-full h-[56px] flex items-center py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.country)}`}
                >
                  <CountrySelect
                    selectedCountry={shippingData.country}
                    onCountryChange={handleCountryChange}
                  />
                </div>
                <div className="md:mb-4 w-full sm:w-1/2 h-[56px]">
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={shippingData.zip}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.zip)}`}
                    placeholder="Zip code"
                    required
                  />
                  {errors.zip && (
                    <span className="text-red-500 text-sm">Please enter a valid Zip Code</span>
                  )}
                </div>
              </div>

              <div className="flex items-center cursor-pointer text-[#6F6F6F] text-[14px] font-heebo md:block hidden mt-0" onClick={handleToggleCompanyInput}>
                {!showCompanyInput && (
                  <div className='flex items-center relative'>
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
                <div className="mb-5 max-w-[511px] w-full md:block hidden">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={shippingData.company || ''}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.company)}`}
                    placeholder="Company Name (optional)"
                  />
                </div>
              )}

              <div className="flex items-center cursor-pointer text-[#6F6F6F] text-[14px] font-heebo md:hidden block" onClick={handleToggleCompanyInput}>
                {!showCompanyInput && (
                  <div className='flex items-center relative'>
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
                <div className=" mb-max-w-[511px] w-full md:hidden block">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={shippingData.company || ''}
                    onChange={handleChange}
                    className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.company)}`}
                    placeholder="Company Name (optional)"
                  />
                </div>
              )}

              <h2 className="font-Heebo-18 text-[#424242] md:pt-5 pt-[30px]">How can we reach you?</h2>
              <div className="mb-5 max-w-[511px] w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingData.email}
                  onChange={handleChange}
                  className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.email)}`}
                  placeholder="Email"
                  required
                />
                <div className='md:hidden block font-Heebo-reg-14 mt-[10px]'>
                  We’ll send your receipt and updates by email.
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">Please enter a valid Email</span>
                )}
              </div>
              <div className="mb-5 max-w-[511px] w-full">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleChange}
                  className={`block w-full h-[56px] px-4 py-2 rounded-[10px] text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.phone)}`}
                  placeholder="Phone"
                  required
                />
                <div className='md:hidden block font-Heebo-reg-14 mt-[10px] md:mb-0 mb-1'>
                  Make sure your phone number is correct. It can’t be changed.
                </div>
                {errors.phone && (
                  <span className="text-red-500 text-sm">Please enter a valid Phone Number</span>
                )}
              </div>
              <button
                type="submit"
                className={`bg-[#E5E5E5] py-2 h-[56px] rounded-[10px] w-full font-Heebo-16 text-white ${isFormValid ? 'hover:bg-[#9E9EA0] text-white' : 'opacity-50 cursor-not-allowed text-white'}`}
                disabled={!isFormValid}
              >
                Continue to Payment
              </button>
            </form>
          </div>

          <Order items={items} />
        </div>
        <div className="w-full lg:w-1/3 md:p-4 md:block hidden">
          {/* <CheckoutCart /> */}
          <div className="p-4 text-[14px] font-heebo leading-[14px]">
            <h1 className="font-Heebo-16 mb-2 text-[#1E1E1E]">Important to Know About Your Delivery:</h1>
            <ul className="list-disc pl-4 text-[#6F6F6F]">
              <li className="mb-2 font-Heebo-reg-14"><span className='font-Heebo-14 text-[#1E1E1E]'>Signature Required: </span>The carrier may require a signature upon delivery.</li>
              <li className="w-[291px] font-Heebo-reg-14"> <span className='font-Heebo-14 text-[#1E1E1E]'>Flexible Delivery Options: </span>
                Once your order is shipped, you'll be able to track it and adjust the delivery. You can redirect it to a pickup location, hold it at a secure site, or complete a signature waiver for a contactless delivery.
              </li>
            </ul>
          </div>
          <div className='space-y-[48px] leading-[14px]'>
            <div className='text-[14px] font-heebo text-[#6F6F6F] md:mt-[565px]'>
              <p>We’ll email you a receipt and send order updates to your mobile phone via SMS or iMessage.</p>
            </div>
            <div className='text-[14px] font-heebo text-[#6F6F6F]'>
              <p>The phone number you enter can't be changed after you place your order, so please make sure it's correct.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
