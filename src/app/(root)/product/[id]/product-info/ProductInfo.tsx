import Link from 'next/link'

import { PUBLIC_URL } from '@/config/url.config'

import { IProduct } from '@/shared/types/product.interface'

import { formatPrice } from '@/utils/string/format-price'

import { AddToCartButton } from './AddToCartButton'
import { FavoriteButton } from './FavoriteButton'
import CheckoutButton from './ByNow'

interface ProductInfoProps {
	product: IProduct
}

export function ProductInfo({ product }: ProductInfoProps) {
	const rating =
		Math.round(
			product.reviews.reduce((acc, review) => acc + review.rating, 0) /
				product.reviews.length
		) || 0

	return (
		<div className="mt-10 space-y-5 sm:mt-16 lg:mt-0 md:w-[594px] w-full">
			<div className='flex items-center gap-5'>
				<h1 className="text-2xl text-black font-heebo bg-clip-tex">
					{product.title}
				</h1>
				<FavoriteButton product={product} />
			</div>
			<div className="flex items-center">
				<Link className="text-[16px] font-heebo text-[#8C8C8C]" href={PUBLIC_URL.category(product.category.id)}>
					{product.category.title}
				</Link>
			</div>
			<div className='flex gap-5'>
				<div className="text-[13px] font-heebo flex items-center justify-center text-[#424242]">{formatPrice(product.price)}</div>	
				<div className="flex items-center gap-x-4 border bg-[#A1A1A1]/10 rounded-xl">
				</div>
				<span className="text-sm font-heebo text-[#BDBDBD]">{product.color.name}</span>

			</div>
			<div className="flex items-center gap-x-4">
				<div className="flex items-center gap-x-2">
				<div
					className="w-6 h-6 rounded-full border border-gray-600"
					style={{ backgroundColor: product.color.value }} 
				/>
				</div>
			</div>
			<p className="text-sm text-muted-foreground font-heebo font-light text-[#BDBDBD] max-w-[393px] w-full">{product.description}</p>
			<div className="flex flex-col md:flex-row items-start gap-x-2 w-full">
				<div className="w-full">
					<AddToCartButton product={product} />
					<CheckoutButton />
				</div>
			</div>
		</div>
	)
}
