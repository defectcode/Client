// /pages/error.tsx
import { MdError } from 'react-icons/md';

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <MdError className="text-red-600 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Error</h1>
      <p className="text-lg text-gray-700 mb-6">
        Something went wrong with your payment. Please try again later or contact support for assistance.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
      >
        Go Back to Home
      </a>
    </div>
  );
};

export default Error;
