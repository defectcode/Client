import { Button } from '@/components/ui/Button'

import { useActions } from '@/hooks/useActions'
import { useCart } from '@/hooks/useCart'

import { IProduct } from '@/shared/types/product.interface'

interface AddToCartButtonProps {
	product: IProduct
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
	const { addToCart, removeFromCart } = useActions()
	const { items } = useCart()

	const currentElement = items.find(
		cartItem => cartItem.product.id === product.id
	)

	return (
		<Button
		className="bg-transparent text-[#1E1E1E] border rounded-[16px] max-w-[393px] h-[48px] w-full font-heebo" // w-full pentru mobil
		onClick={() =>
			currentElement
			? removeFromCart({ id: currentElement.id })
			: addToCart({
					product,
					quantity: 1,
					price: product.price
				})
		}
		>
			{currentElement ? 'Remove from Bag' : 'Add to Bag'}
		</Button>

	)
}
