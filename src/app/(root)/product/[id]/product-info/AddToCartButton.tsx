import { Button } from '@/components/ui/Button'
// import { ButtonAdd } from '@/components/ui/ButtonAdd'

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
			variant='primary'
			size='lg'
			className="bg-gradient-to-r from-pink-300 to-orange-300 text-black rounded-full max-w-[393px] w-full font-heebo"
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
