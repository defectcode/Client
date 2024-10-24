import Image from 'next/image';
import { useState } from 'react';
import PayPalButton from '../../PayPalButton';
import CheckoutPage from './StripePaymentButton';

interface PaymentProps {
  items: any[]; // Ar trebui să fie ICartItem[], dar depinde de datele tale reale
}

export default function Order({ items }: PaymentProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardError, setCardError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvvError, setCvvError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);


  const taxRate = 0.2; 
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const estimatedTax = subtotal * taxRate;
  const total = subtotal + estimatedTax;

  const validateCardNumber = (card: string) => {
    const cardNumber = card.replace(/\D/g, ''); // Remove non-digits
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiry: string) => {
    // Acceptă atât formatul MM/YY cât și MM/YYYY
    const regex = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
    if (!regex.test(expiry)) return false;
  
    const [month, year] = expiry.split('/');
    const expiryMonth = parseInt(month);
    let expiryYear = parseInt(year);
  
    // Dacă anul este în format de 2 cifre, îl transformăm în 4 cifre (ex. 28 devine 2028)
    if (year.length === 2) {
      expiryYear += 2000;
    }
  
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
  
    return !(expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth));
  };
  

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
    const isValid = validateCardNumber(e.target.value);
    setCardError(isValid ? '' : 'Invalid card number');
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(e.target.value);
    const isValid = validateExpiryDate(e.target.value);
    setExpiryError(isValid ? '' : 'Invalid expiry date');
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value);
    const isValid = /^[0-9]{3,4}$/.test(e.target.value);
    setCvvError(isValid ? '' : 'Invalid CVV');
  };

  const isFormValid = !cardError && !expiryError && !cvvError && cardNumber && expiryDate && cvv;

  const handleCardPayment = () => {
    if (isFormValid) {
      console.log('Processing card payment...');
    } else {
      alert('Please fill in all card details correctly.');
    }
  };

  return (
    <div className="md:py-5 md:pb-0 pb-5 max-w-[511px] w-full mx-auto">
      <h2 className="text-xl font-semibold mb-5 leading-[20px]">How would you like to pay?</h2>

      <div className="flex items-center justify-center md:space-x-5 space-x-[10px]">
        <button
          className={`py-2 px-4 border md:h-[56px] h-10 w-1/3 flex items-center justify-center bg-[#FFFFFF] ${selectedPaymentMethod === 'Card' ? 'border-[#000000]/50' : 'border-gray-300'} rounded-[10px]`}
          onClick={() => setSelectedPaymentMethod('Card')}
        >
          <Image src='/images/cardBlack.svg' alt='paypal' width={55} height={15} />
          <CheckoutPage />
        </button>
        <button
          className={`py-2 px-4 border md:h-[56px] h-10 w-1/3 flex items-center justify-center bg-[#FFFFFF] ${selectedPaymentMethod === 'GooglePay' ? 'border-[#000000]/50' : 'border-gray-300'} rounded-[10px]`}
          onClick={() => setSelectedPaymentMethod('GooglePay')}
        >
          <Image src='/images/googlepay.svg' alt='googlepay' width={52} height={24} />
          <CheckoutPage />
        </button>
        <button
          className={`py-2 px-5 border md:h-[56px] h-10 w-1/3 flex items-center justify-center bg-[#FFFFFF] ${selectedPaymentMethod === 'PayPal' ? 'border-[#000000]/50' : 'border-gray-300'} rounded-[10px]`}
          onClick={() => setSelectedPaymentMethod('PayPal')}
        >
          <Image src='/images/paypalBlue.svg' alt='paypal' width={48} height={13} />
        </button>
      </div>

      {selectedPaymentMethod === 'Card' && (
        <div>
          <h3 className="font-Heebo-reg-14 my-5">Enter your card details:</h3>
          <div className="border-gray-300 rounded-[10px] md:space-y-5 space-y-[10px] relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className={`max-w-[520px] w-full p-4 border h-[56px] rounded-[10px] ${cardError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Card number"
            />
            {cardError && <p className="text-red-500 text-sm">{cardError}</p>}
            
            <div className="flex space-x-5 relative items-center">
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                className={`max-w-[372px] w-full p-4 border h-[56px] rounded-[10px] ${expiryError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="MM / YY"
              />
              <div className="relative w-1/2 flex items-center gap-[10px]">
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  className={`max-w-[98px] w-full p-4 border h-[56px] rounded-[10px] ${cvvError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="CVV"
                />
                <span
                  className="cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Image src="/images/question-icon.svg" alt="info" width={18} height={18} className='' />
                </span>
                {showTooltip && (
                  <div className="absolute bg-gray-100 text-gray-700 text-sm p-3 rounded-[10px] shadow-lg w-[250px] bottom-full mb-2">
                    The sales tax listed on the checkout page is only an estimate. Your invoice will contain the final sales tax, including state and local taxes, as well as any applicable rebates or fees.
                  </div>
                )}
              </div>
            </div>
            {expiryError && <p className="text-red-500 text-sm">{expiryError}</p>}
            {cvvError && <p className="text-red-500 text-sm">{cvvError}</p>}
          </div>
          <p className='border border-[#7C788A]/20 max-w-[520px] mt-5'></p>
          <p className='font-Heebo-reg-15 text-[#6F6F6F] mb-5 mt-10'>By clicking the "Payment" button, you confirm that you have read, understand, and accept our <span className='font-Heebo-bold-15 underline text-[#6F6F6F]'>Terms of Sale, Privacy Policy</span>, and <span className='font-Heebo-bold-15 underline text-[#6F6F6F]'>Return Policy.</span></p>
        </div>
      )}

      {selectedPaymentMethod === 'PayPal' && (
        <div className="w-full">
          <PayPalButton totalAmount={total} />
        </div>      
      )}

      {selectedPaymentMethod === 'Card' && (
        <button
          onClick={handleCardPayment}
          className={`bg-[#E5E5E5] text-[#9E9EA0] py-2 rounded-[10px] h-[56px] w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed ' : 'hover:bg-gray-800'}`}
          disabled={!isFormValid}
        >
          Payment
           {/* ${total.toFixed(2)} */}
        </button>
      )}
    </div>
  );
}
