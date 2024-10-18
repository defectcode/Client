import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Image from 'next/image';

const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY;

if (!stripePublicKey) {
  throw new Error('Stripe public key is not defined in environment variables.');
}

const stripePromise = loadStripe(stripePublicKey);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Când formularul este trimis, inițiem procesul de plată
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement!,
        billing_details: {
          name: 'John Doe', // Poți prelua aceste detalii din formularul utilizatorului
        },
      },
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      alert('Payment succeeded!');
      setIsProcessing(false);
    }
  };

  // Cerem backend-ului să creeze un Payment Intent și să returneze un clientSecret
  const fetchClientSecret = async () => {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 5000 }), // Exemplu pentru suma de 50 USD (5000 de cenți)
    });
  
    const { clientSecret } = await response.json();
    
    console.log(clientSecret); // Verifică ce valoare primești aici
    setClientSecret(clientSecret);
  };
  
  

  // Când componenta se montează, inițiem cererea pentru a obține clientSecret
  React.useEffect(() => {
    fetchClientSecret();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={isProcessing || !stripe || !elements}>
        <Image src='/images/paypal.svg' alt='PayPal' width={48} height={13} />
      </button>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
