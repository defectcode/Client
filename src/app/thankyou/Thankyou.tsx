// /pages/thankyou.tsx
import { FaCheckCircle } from 'react-icons/fa';

const ThankYou = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
      <FaCheckCircle className="text-green-600 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your payment was successful. We appreciate your purchase.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
      >
        Go Back to Home
      </a>
    </div>
  );
};

export default ThankYou;
