'use client'
import { useState } from 'react';
import Link from 'next/link';
import { HeaderCart } from './header-menu/header-cart/HeaderCart';
import { HeaderMenu } from './header-menu/HeaderMenu';
import { Logo } from './logo/Logo';
import { SearchInput } from './search-input/SearchInput';
import { DASHBOARD_URL } from '@/config/url.config';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { User } from './header-menu/header-cart/cart-item/user';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  return (
    <div className="p-5 max-w-[1400px] w-full h-full flex items-center justify-between bg-transparent mx-auto">
      <div className="flex-1 lg:block hidden">
        <HeaderMenu />
      </div>
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-end lg:flex hidden">
        <SearchInput />
        <User />
        <Button variant="ghost" onClick={toggleCart}>
          <Image src="/images/shop.svg" alt="shop" width={15} height={17} />
        </Button>
      </div>
      <button className="lg:hidden p-2" onClick={toggleBurger}>
        <AiOutlineMenu size={24} />
      </button>

      {isBurgerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-64 h-full shadow-lg fixed right-0 top-0 p-5 flex flex-col items-start justify-start">
            <button 
              className="text-2xl font-bold mb-5 self-end" 
              onClick={toggleBurger}
            >
              <AiOutlineClose size={24} />
            </button>
            <HeaderMenu />
            <SearchInput />
            <User />
            <Button variant="ghost" onClick={toggleCart}>
              <Image src="/images/shop.svg" alt="shop" width={15} height={17} />
            </Button>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-[430px] w-full relative">
            <button 
              className="absolute top-5 right-5 text-2xl font-bold" 
              onClick={toggleCart}
            >
              <Image src='/images/close.svg' alt='close' width={12} height={12}/>
            </button>
            <HeaderCart />
          </div>
        </div>
      )}
    </div>
  );
}
