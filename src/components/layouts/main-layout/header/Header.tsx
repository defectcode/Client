'use client'
import Link from 'next/link';
import { HeaderCart } from './header-menu/header-cart/HeaderCart';
import { HeaderMenu } from './header-menu/HeaderMenu';
import { Logo } from './logo/Logo';
import { SearchInput } from './search-input/SearchInput';
import { DASHBOARD_URL } from '@/config/url.config';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="p-5 max-w-[1400px] w-full h-full flex items-center justify-between bg-transparent mx-auto">
      <div className="flex-1">
        <HeaderMenu />
      </div>
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>
      <div className="flex-1 flex justify-end">
        <Link href={DASHBOARD_URL.favorites()}>
          <Button variant="ghost">
            <Image src="/images/shop.svg" alt="shop" width={15} height={17} />
          </Button>
        </Link>
        
        <Button variant="ghost" onClick={toggleCart}>
          Cart
        </Button>
        
        <SearchInput />
      </div>

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
