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
    country: 'MD', // Cod implicit pentru țară
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
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
  
    if (!isFormValid) return;
  
    // Preluăm lista de produse din `items`
    const products = items.map((item) => ({
      name: item.product,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const emailData = {
      email: shippingData.email,
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      products, // Adăugăm produsele la payload
    };
  
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Failed to send email:', data);
        return;
      }
  
      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Error while sending email:', error);
    }
  
    setIsSubmitted(true);
    setIsEditing(false);
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
      <div className="my-6">
        <Header />
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
            <Order items={items}/>
          </div>
          <div className="w-full lg:w-1/3 md:p-4">
            <CheckoutCart />
          </div>
        </div>
      </div>
    );
  }

  // Formularul inițial sau modul de editare
  return (
    <div className="my-6">
      <Header />
      <div className="w-full lg:w-1/3 md:p-4 md:hidden">
          <CheckoutCart />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-4 sm:px-6 lg:px-0">
        <div className="w-full max-w-[620px] flex flex-col gap-10 justify-center items-center md:p-4 sm:p-6 pt-0 mb-6 lg:mb-0">
          <div className="w-full max-w-[511px]">
            {/* Express Checkout */}
            <button
              className="w-full text-left pb-4 font-semibold font-heebo text-[20px] text-[#424242]"
            >
              Express Checkout {isExpressCheckoutVisible ? '▲' : '▼'}
            </button>

            {isExpressCheckoutVisible && (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex gap-5 h-[56px]">
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      {/* <PayPalButton totalAmount={totalAmount} /> */}
                    <Image src='/images/paypal.svg' alt='PayPal' width={48} height={13} />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      <Image src='/images/applepay.svg' alt='Apple Pay' width={42} height={16} />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      <Image src='/images/amazonpay.svg' alt='Amazon Pay' width={81} height={15} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-[28px]">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 text-gray-500 text-sm">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </>
            )}

            <h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242] mt-[48px]">Shipping Details</h2>
            <form onSubmit={handleSubmit} className='space-y-[20px]'>
              <div className="flex gap-[18px] max-w-[511px] w-full flex-col sm:flex-row">
                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.firstName)}`}
                    placeholder="First Name"
                    required
                  />
                  {/* {!errors.firstName && (
                    <label htmlFor="firstName" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      First Name
                    </label> */}
                  {/* )} */}
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">Please enter a valid First Name</span>
                  )}
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.lastName)}`}
                    placeholder="Last Name"
                    required
                  />
                  {/* {!errors.lastName && (
                    <label htmlFor="lastName" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Last Name
                    </label>
                  )} */}
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">Please enter a valid Last Name</span>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.address)}`}
                  placeholder="Start typing your street address"
                  required
                />
                {/* {!errors.address && (
                  <label htmlFor="address" className="block text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Street address
                  </label>
                )} */}
                {errors.address && (
                  <span className="text-red-500 text-sm">Please enter a valid address</span>
                )}
              </div>

              <div className="flex gap-[14px] max-w-[511px] w-full flex-col sm:flex-row">
                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingData.city}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.city)}`}
                    placeholder="City/Town"
                    required
                  />
                  {/* {!errors.city && (
                    <label htmlFor="city" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      City/Town
                    </label>
                  )} */}
                  {errors.city && (
                    <span className="text-red-500 text-sm">Please enter a valid City</span>
                  )}
                </div>

                <div className="w-full sm:w-1/2">
                  <CountrySelect
                    selectedCountry={shippingData.country}
                    onCountryChange={handleCountryChange}
                  />
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={shippingData.zip}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.zip)}`}
                    placeholder="Zip code"
                    required
                  />
                  {/* {!errors.zip && (
                    <label htmlFor="zip" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Zip code
                    </label>
                  )} */}
                  {errors.zip && (
                    <span className="text-red-500 text-sm">Please enter a valid Zip Code</span>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.email)}`}
                  placeholder="Email"
                  required
                />
                {/* {!errors.email && (
                  <label htmlFor="email" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Email
                  </label>
                )} */}
                {errors.email && (
                  <span className="text-red-500 text-sm">Please enter a valid Email</span>
                )}
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.phone)}`}
                  placeholder="Phone"
                  required
                />
                {/* {!errors.phone && (
                  <label htmlFor="phone" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Phone
                  </label>
                )} */}
                {errors.phone && (
                  <span className="text-red-500 text-sm">Please enter a valid Phone Number</span>
                )}
              </div>

              <button
                type="submit"
                className={`bg-gray-700 text-white py-2 rounded-md mt-4 w-full ${isFormValid ? 'hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isFormValid}
              >
                Save & Continue
              </button>
            </form>
          </div>
          <Order items={items} />
        </div>
        <div className="w-full lg:w-1/3 md:p-4 md:block hidden">
          <CheckoutCart />
        </div>
      </div>
    </div>
  );
}





/*
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/main-layout/header/Header';
import { CheckoutCart } from '../../../src/components/layouts/main-layout/header/header-menu/header-cart/CheckoutCart';
import { useProfile } from '@/hooks/useProfile';
import { useCart } from '@/hooks/useCart';
import { CountrySelect } from './components/CountrySelect';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import Image from 'next/image';
import Order from '../../components/layouts/main-layout/header/header-menu/header-cart/cart-item/components/order/Order';
import PayPalButton from '@/components/layouts/main-layout/header/header-menu/header-cart/cart-item/PayPalButton';

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
    country: 'MD', // Cod implicit pentru țară
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpressCheckoutVisible, setExpressCheckoutVisible] = useState(true);

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
  
    if (!isFormValid) return;
  
    setIsSubmitted(true);
    setIsEditing(false);
  };

  // Funcția pentru trimiterea email-ului
  const sendOrderEmail = async () => {
    const products = items.map((item) => ({
      name: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const emailData = {
      email: shippingData.email,
      firstName: shippingData.firstName,
      lastName: shippingData.lastName,
      products,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to send email:', data);
      } else {
        console.log('Email sent successfully:', data);
      }
    } catch (error) {
      console.error('Error while sending email:', error);
    }
  };

  //Total:
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxRate = 0.2;
  const totalAmount = subtotal + subtotal * taxRate;

  const getInputStyles = (error: string) => {
    return `border ${error ? 'border-red-500 bg-red-100 text-red-500 placeholder-red-500' : 'border-gray-300'} focus:bg-blue-100 focus:outline-none focus:border-blue-500 transition-colors duration-300 ease-in-out`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsSubmitted(false); 
  };

  if (isSubmitted && !isEditing) {
    return (
      <div className="my-6">
        <Header />
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
            <Order items={items}/>
          </div>
          <div className="w-full lg:w-1/3 md:p-4">
            <CheckoutCart />
          </div>
        </div>
      </div>
    );
  }

  // Formularul inițial sau modul de editare
  return (
    <div className="my-6">
      <Header />
      <div className="w-full lg:w-1/3 md:p-4 md:hidden">
          <CheckoutCart />
      </div>
      <div className="container mx-auto flex flex-col lg:flex-row justify-center items-start lg:h-screen pt-6 px-4 sm:px-6 lg:px-0">
        <div className="w-full max-w-[620px] flex flex-col gap-10 justify-center items-center md:p-4 sm:p-6 pt-0 mb-6 lg:mb-0">
          <div className="w-full max-w-[511px]">
            <button className="w-full text-left pb-4 font-semibold font-heebo text-[20px] text-[#424242]">
              Express Checkout {isExpressCheckoutVisible ? '▲' : '▼'}
            </button>

            {isExpressCheckoutVisible && (
              <>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex gap-5 h-[56px]">
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      <Image src='/images/paypal.svg' alt='PayPal' width={48} height={13} />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      <Image src='/images/applepay.svg' alt='Apple Pay' width={42} height={16} />
                    </button>
                    <button className="w-full py-2 border rounded-[10px] flex items-center justify-center">
                      <Image src='/images/amazonpay.svg' alt='Amazon Pay' width={81} height={15} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-[28px]">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <h1 className="mx-2 text-gray-500 text-sm">OR</h1>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </>
            )}

<h2 className="text-[20px] font-semibold font-heebo mb-4 text-[#424242] mt-[48px]">Shipping Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-[14px] max-w-[511px] w-full flex-col sm:flex-row">
                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.firstName)}`}
                    placeholder="First Name"
                    required
                  />
                  {!errors.firstName && (
                    <label htmlFor="firstName" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      First Name
                    </label>
                  )}
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">Please enter a valid First Name</span>
                  )}
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.lastName)}`}
                    placeholder="Last Name"
                    required
                  />
                  {!errors.lastName && (
                    <label htmlFor="lastName" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Last Name
                    </label>
                  )}
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">Please enter a valid Last Name</span>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.address)}`}
                  placeholder="Start typing your street address"
                  required
                />
                {!errors.address && (
                  <label htmlFor="address" className="block text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Street address
                  </label>
                )}
                {errors.address && (
                  <span className="text-red-500 text-sm">Please enter a valid address</span>
                )}
              </div>

              <div className="flex gap-[14px] max-w-[511px] w-full flex-col sm:flex-row">
                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingData.city}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.city)}`}
                    placeholder="City/Town"
                    required
                  />
                  {!errors.city && (
                    <label htmlFor="city" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      City/Town
                    </label>
                  )}
                  {errors.city && (
                    <span className="text-red-500 text-sm">Please enter a valid City</span>
                  )}
                </div>

                <div className="w-full sm:w-1/2">
                  <CountrySelect
                    selectedCountry={shippingData.country}
                    onCountryChange={handleCountryChange}
                  />
                </div>

                <div className="mb-4 w-full sm:w-1/2">
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={shippingData.zip}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.zip)}`}
                    placeholder="Zip code"
                    required
                  />
                  {!errors.zip && (
                    <label htmlFor="zip" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                      Zip code
                    </label>
                  )}
                  {errors.zip && (
                    <span className="text-red-500 text-sm">Please enter a valid Zip Code</span>
                  )}
                </div>
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.email)}`}
                  placeholder="Email"
                  required
                />
                {!errors.email && (
                  <label htmlFor="email" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Email
                  </label>
                )}
                {errors.email && (
                  <span className="text-red-500 text-sm">Please enter a valid Email</span>
                )}
              </div>

              <div className="mb-4 max-w-[511px] w-full">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[48px] px-4 py-2 rounded-md text-[14px] font-heebo placeholder-gray-400 ${getInputStyles(errors.phone)}`}
                  placeholder="Phone"
                  required
                />
                {!errors.phone && (
                  <label htmlFor="phone" className="block font-medium text-[#BDBDBD] font-heebo text-[12px] ml-[10px]">
                    Phone
                  </label>
                )}
                {errors.phone && (
                  <span className="text-red-500 text-sm">Please enter a valid Phone Number</span>
                )}
              </div>

              <button
                type="submit"
                className={`bg-gray-700 text-white py-2 rounded-md mt-4 w-full ${isFormValid ? 'hover:bg-gray-800' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!isFormValid}
              >
                Save & Continue
              </button>
            </form>
          </div>
          <Order items={items} />
        </div>
        <div className="w-full lg:w-1/3 md:p-4 md:block hidden">
          <CheckoutCart />
        </div>
      </div>
    </div>
  );
}
*/
