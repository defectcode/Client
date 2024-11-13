'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HeaderCart } from './header-menu/header-cart/HeaderCart'
import { HeaderMenu } from './header-menu/HeaderMenu'
import { Logo } from './logo/Logo'
import { SearchInput } from './search-input/SearchInput'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { User } from './header-menu/header-cart/cart-item/user'

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const toggleBurger = () => {
    setIsBurgerOpen(!isBurgerOpen)
  }

  return (
    <div className="md:py-5 p-0 max-w-[1400px] w-full md:h-full h-[60px] flex items-center justify-between bg-transparent mx-auto">
      
      {/* Versiunea Desktop */}
      <div className="flex-1 lg:block hidden">
        <HeaderMenu />
      </div>
      <div className="flex-1 lg:block hidden relative">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end lg:flex hidden">
        <SearchInput />
        <User />
        <Button variant="ghost" onClick={toggleCart}>
          <Image src="/images/shop.svg" alt="shop" width={15} height={17} />
        </Button>
      </div>
      
      {/* Versiunea Mobilă */}
      <div className="flex items-center justify-between w-full lg:hidden p-4">
        <Link href="/" className="p-2">
          <Image src="/images/home.svg" alt="home" width={15} height={15} />
        </Link>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2">
            <Image src="/images/search.svg" alt="search" width={11} height={14} />
          </button>
          <button className="p-2">
            <Image src="/images/user.svg" alt="user" width={14} height={14} />
          </button>
          <button onClick={toggleCart} className="p-2">
            <Image src="/images/shop.svg" alt="cart" width={13} height={15} />
          </button>
        </div>
      </div>

      {/* Coșul de cumpărături (vizibil atât pe mobil, cât și pe desktop) */}
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
  )
}
