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
      // Logica de procesare a plății cu cardul
      console.log('Processing card payment...');
      // Adaugă aici logica necesară pentru integrarea plății
    } else {
      alert('Please fill in all card details correctly.');
    }
  };

  return (
    <div className="py-5 bg-white max-w-[511px] w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          className={`py-2 px-4 border h-[56px] w-1/3 flex items-center justify-center ${selectedPaymentMethod === 'ApplePay' ? 'border-black' : 'border-gray-300'} rounded-lg`}
          onClick={() => setSelectedPaymentMethod('ApplePay')}
        >
          <Image src='/images/applepay.svg' alt='applepay' width={42} height={16} />
          <CheckoutPage />
        </button>

        <button
          className={`py-2 px-4 border h-[56px] w-1/3 flex items-center justify-center ${selectedPaymentMethod === 'Card' ? 'border-black' : 'border-gray-300'} rounded-lg`}
          onClick={() => setSelectedPaymentMethod('Card')}
        >
          💳 Card
        </button>
        <button
          className={`py-2 px-4 border h-[56px] w-1/3 flex items-center justify-center ${selectedPaymentMethod === 'PayPal' ? 'border-black' : 'border-gray-300'} rounded-lg`}
          onClick={() => setSelectedPaymentMethod('PayPal')}
        >
          <Image src='/images/paypal.svg' alt='paypal' width={42} height={16} />
        </button>
      </div>

      {selectedPaymentMethod === 'Card' && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Card details</h3>
          <div className="border rounded-[10px] relative">
            <div className='flex items-center justify-between border-b'>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`w-full p-2 flex items-center px-[17px] md:h-[56px] ${cardError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Card number"
              />
              <Image src="/images/look.svg" alt="look" width={20} height={20} className='mr-[17px]'/>
            </div>
            {cardError && <p className="text-red-500 text-sm">{cardError}</p>}

            <div className="flex space-x-4">
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                className={`w-1/2 pl-[17px] border-r md:h-[56px] ${expiryError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="MM / YY"
              />
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                className={`w-1/2 p-2 rounded-lg ${cvvError ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="CVV"
              />
            </div>
            {expiryError && <p className="text-red-500 text-sm">{expiryError}</p>}
            {cvvError && <p className="text-red-500 text-sm">{cvvError}</p>}
          </div>
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
          className={`bg-gray-700 text-white py-2 rounded-md mt-4 w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed ' : 'hover:bg-gray-800'}`}
          disabled={!isFormValid}
        >
          Pay ${total.toFixed(2)}
        </button>
      )}
    </div>
  );
}
