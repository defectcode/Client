'use client'; // Asigură-te că acest fișier este un component client

import { PUBLIC_URL } from '@/config/url.config';
import { useRouter } from 'next/navigation';
import React from 'react';

const ByNowButton: React.FC = () => {
  const router = useRouter();

  const handleCheckout = (): void => {
    router.push(PUBLIC_URL.checkout());
};

  return (
    <button
    onClick={handleCheckout}
    className="flex items-center justify-center md:w-[393px] w-full h-10 text-[#424242] px-6 py-3 rounded-full border mt-[10px] font-heebo"
    >
      Buy Now
    </button>

  );
};

export default ByNowButton;
