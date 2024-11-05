import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

import { Button } from '@/components/ui/Button'

import { useProfile } from '@/hooks/useProfile'

import { userService } from '@/services/user.service'

import { IProduct } from '@/shared/types/product.interface'
import Image from 'next/image'

interface FavoriteButtonProps {
	product: IProduct
}

export function FavoriteButton({ product }: FavoriteButtonProps) {
	const { user } = useProfile()

	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationKey: ['toggle favorite'],
		mutationFn: () => userService.toggleFavorite(product.id),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['profile']
			})
		}
	})

	if (!user) return null

	const isExists = user.favorites.some(favorite => favorite.id === product.id)

	return (
		<Button
			className='bg-transparent'
			variant='secondary'
			size='icon'
			onClick={() => mutate()}
			disabled={isPending}
		>
			{isExists ? (
				<Image src='/images/selectHeart.svg' alt='heart' height={16} width={17} color='#8C8C8C' />
			) : (
				<Image src='/images/heart.svg' alt='heart' height={16} width={17} color='#8C8C8C'/>
			)}
		</Button>
	)
}
