'use client'  // Asigură-te că această componentă este client-side

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/utils/string/format-price'
import { PUBLIC_URL } from '@/config/url.config'
import { IProduct } from '@/shared/types/product.interface'
import ByNowButton from '@/app/(root)/product/[id]/product-info/ByNow'

import './ProductCard.css'

interface ProductCardCheckoutProps {
  product: IProduct
}

export function ProductCardCheckout({ product }: ProductCardCheckoutProps) {
  const { items } = useCart()
  const router = useRouter()  // Asigură-te că folosești router-ul aici

  if (!items || items.length === 0) {
    return <p>No items in cart.</p>
  }

  const totalProducts = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const delivery = 20.00
  const sales = totalProducts * 0.3 
  const total = totalProducts + delivery + sales

  const handleCheckout = () => {
    router.push('/checkout')  // Redirecționează către pagina de checkout
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {items.length ? (
            items.map(item => (
              <div className="bg-white py-10 px-5 border rounded-lg" key={item.id}>
                <div className="flex items-start justify-between">
                  <div className="flex">
                    <Link href={PUBLIC_URL.product(item.product.id)} className="relative h-28 w-28 rounded-md overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="ml-6">
                      <h2 className="font-medium truncate-2-lines">{item.product.title}</h2>
                      <p className="text-sm text-gray-500 mt-1 max-w-[600px] truncate-2-lines">
                        {item.product.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Id Product: {item.product.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <p className="text-sm">Size: One Size</p>
                    <p className="text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
          )}
        </div>

        <div className="col-span-1">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <p>{items.length} Product{items.length > 1 ? 's' : ''}</p>
              <p>{formatPrice(totalProducts)}</p>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <p>Delivery</p>
              <p>{formatPrice(delivery)}</p>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <p>Sales</p>
              <p>{formatPrice(sales)}</p>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-6">
              <p>Total</p>
              <p>{formatPrice(total)}</p>
            </div>

            {/* Modificăm stilurile butonului Checkout */}
            <button
              className="w-full py-3 text-white rounded-lg bg-gradient-to-r from-pink-300 to-orange-300 font-bold text-lg"
              onClick={handleCheckout}
            >
              Checkout
            </button>

            <ByNowButton />
          </div>
        </div>
      </div>
    </div>
  )
}
