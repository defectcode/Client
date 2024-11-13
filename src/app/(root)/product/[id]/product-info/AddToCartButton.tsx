import { Button } from '@/components/ui/Button'
import { useActions } from '@/hooks/useActions'
import { useCart } from '@/hooks/useCart'
import { IProduct } from '@/shared/types/product.interface'
import './Production.css'

interface AddToCartButtonProps {
  product: IProduct
  onAddToCart?: () => void // Adăugăm proprietatea onAddToCart
}

export function AddToCartButton({ product, onAddToCart }: AddToCartButtonProps) {
  const { addToCart, removeFromCart } = useActions()
  const { items } = useCart()

  const currentElement = items.find(
    cartItem => cartItem.product.id === product.id
  )

  const handleAddToCart = () => {
    if (currentElement) {
      removeFromCart({ id: currentElement.id })
    } else {
      addToCart({
        product,
        quantity: 1,
        price: product.price
      })
      if (onAddToCart) onAddToCart() // Apelează funcția onAddToCart dacă este definită
    }
  }

  return (
    <button
      className="bg-transparent text-[#1E1E1E] border-[#1E1E1E] border rounded-[10px] max-w-[393px] h-[48px] w-full font-Heebo-16"
      onClick={handleAddToCart}
    >
      {currentElement ? 'Remove from Bag' : 'Add to Bag'}
    </button>
  )
}
