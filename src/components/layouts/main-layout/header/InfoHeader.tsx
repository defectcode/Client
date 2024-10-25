'use client'
import { useState } from 'react';
import { Logo } from './logo/Logo';
import { CheckoutCartHeader } from './header-menu/header-cart/CheckoutCartHeader';

import './HeaderInfo.css'

export function InfoHeader() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <div className="w-full bg-white">
      <div className="flex md:h-[62px] h-[56px] md:bg-white bg-[#F9F9F9] justify-between items-center w-full max-w-[980px] mx-auto md:border-b">
        <div className="flex-1 hidden md:block">
          <div style={{ fontFamily: 'Heebo, sans-serif' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', lineHeight: '24px', color: '#1E1E1E' }}>
              Checkout
            </h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center md:justify-center">
          <Logo />
        </div>
        
        <div className="flex-1 flex justify-end hidden md:flex">
          <CheckoutCartHeader />
        </div>
      </div>
  </div>
  );
}
