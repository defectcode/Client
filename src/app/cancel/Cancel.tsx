// /pages/cancel.tsx
import { AiOutlineStop } from 'react-icons/ai';

const Cancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center">
      <AiOutlineStop className="text-yellow-600 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">Payment Cancelled</h1>
      <p className="text-lg text-gray-700 mb-6">
        You have cancelled the payment process. If this was a mistake, please try again or contact support.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300"
      >
        Try Again
      </a>
    </div>
  );
};

export default Cancel;
