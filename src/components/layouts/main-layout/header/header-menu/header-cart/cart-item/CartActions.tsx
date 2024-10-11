import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useActions } from '@/hooks/useActions'
import { useCart } from '@/hooks/useCart'
import { ICartItem } from '@/shared/types/cart.interface'

interface CartActionsProps {
	item: ICartItem
}

export function CartActions({ item }: CartActionsProps) {
	const { changeQuantity } = useActions()
	const { items } = useCart()
	const quantity = items.find(cartItem => cartItem.id === item.id)?.quantity

	return (
		<div className="flex items-center mt-1">
			<Button
				onClick={() => changeQuantity({ id: item.id, type: 'minus' })}
				variant='ghost'
				size='icon'
				disabled={quantity === 1}
			>
				<Minus />
			</Button>

			<input
				disabled
				readOnly
				value={quantity}
				className="w-10 text-center text-sm"
			/>

			<Button
				onClick={() => changeQuantity({ id: item.id, type: 'plus' })}
				variant='ghost'
				size='icon'
			>
				<Plus />
			</Button>
		</div>
	)
}
