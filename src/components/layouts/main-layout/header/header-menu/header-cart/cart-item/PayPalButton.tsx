import { useEffect, useState } from 'react';
import './PayPal.css';

interface PayPalButtonProps {
  totalAmount: number;
}

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ totalAmount }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isButtonRendered, setIsButtonRendered] = useState(false);

  const navigateTo = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    const scriptId = 'paypal-script';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=ASOxDBySChHRQPQC0EICF5vMRWfVp-73bRtt8wVOjApc-7OggX1GtvgRas0BwM6thvDslDte3OrezYQ1&currency=USD';
      script.id = scriptId;
      script.async = true;
      script.onload = () => {
        console.log('PayPal script loaded successfully!');
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load PayPal script. Please check your internet connection or PayPal client ID.');
        alert('Failed to load PayPal script. Please check your internet connection or PayPal client ID.');
      };
      document.body.appendChild(script);
    } else {
      console.log('PayPal script already loaded.');
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && !isButtonRendered && window.paypal) {
      try {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const order = await actions.order.capture();
              console.log('Payment approved:', order);

              await fetch('/api/orders/paypal/capture', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: order.id }),
              });

              alert('Payment successful!'); // Notificare pentru utilizator
              navigateTo('/thankyou'); // Redirecționare către pagina "thankyou"
            } catch (error) {
              console.error('Error capturing the payment:', error);
              alert('Failed to capture payment. Please try again.'); // Gestionarea erorii de capturare
              navigateTo('/error'); // Redirecționare către pagina "error"
            }
          },
          onError: (err: any) => {
            console.error('Error with PayPal:', err);
            alert('Payment failed. Please try again or contact support.'); // Gestionarea erorilor PayPal
            navigateTo('/error'); // Redirecționare către pagina "error"
          },
          onCancel: () => {
            console.log('Payment was cancelled.');
            alert('Payment process was cancelled.'); // Notificare pentru utilizator
            navigateTo('/cancel'); // Redirecționare către pagina "cancel"
          },
        }).render('#paypal-button-container');
        setIsButtonRendered(true);
      } catch (error) {
        console.error('Error rendering PayPal button:', error);
        alert('Failed to render PayPal button. Please try again later.');
      }
    } else if (!window.paypal) {
      console.error('PayPal not available on window object');
      alert('PayPal is currently unavailable. Please try again later.');
    }
  }, [isScriptLoaded, totalAmount, isButtonRendered]);

  return (
    <div className="w-full flex justify-center mt-4">
      <div id="paypal-button-container"></div>
      {!isScriptLoaded && <p>Loading PayPal...</p>}
    </div>
  );
};

export default PayPalButton;
