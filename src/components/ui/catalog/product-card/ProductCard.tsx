import Image from 'next/image'
import Link from 'next/link'

import { PUBLIC_URL } from '@/config/url.config'

import { IProduct } from '@/shared/types/product.interface'

import { formatPrice } from '@/utils/string/format-price'

interface ProductCardProps {
	product: IProduct
}

export function ProductCard({ product }: ProductCardProps) {
	return (
		<div className="bg-white">
			<Link href={PUBLIC_URL.product(product.id)}>
				<Image
					src={product.images[0]}
					alt={product.title}
					width={300}
					height={300}
					className="rounded-lg"
				/>
			</Link>

			<h3 className="mt-4 font-semibold text-gray-700 line-clamp-1">{product.title}</h3>
			<Link
				href={PUBLIC_URL.category(product.category.id)}
				className="mt-1 text-sm text-gray-500"
			>
				{product.category.title}
			</Link>
			<p className="mt-1 font-medium text-sm text-gray-900">{formatPrice(product.price)}</p>
		</div>
	)
}
