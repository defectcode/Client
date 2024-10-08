'use client'

import { useQuery } from '@tanstack/react-query'

import { Catalog } from '@/components/ui/catalog/Catalog'

import { productService } from '@/services/product.service'

import { IProduct } from '@/shared/types/product.interface'

import styles from './Product.module.scss'
import { ProductGallery } from './prodcut-gallery/ProdcutGallery'
import { ProductInfo } from './product-info/ProductInfo'
import { ProductReviews } from './product-reviews/ProductReviews'
import AllInfoProducts from './product-info/AllInfoProduct'
import { SectionList } from './product-info/FAQ'

interface ProductProps {
	initialProduct: IProduct
	similarProducts: IProduct[]
	id?: string
}

export function Product({
	initialProduct,
	similarProducts,
	id = ''
}: ProductProps) {
	const { data: product } = useQuery({
		queryKey: ['product', initialProduct.id],
		queryFn: () => productService.getById(id),
		initialData: initialProduct,
		enabled: !!id
	})

	return (
		<div className="mx-auto max-w-[1400px]">
			<div className="space-y-7 px-4 py-10 sm:px-6 lg:px-5">
				<div className="lg:flex lg:items-start lg:gap-x-8">
					<div className='md:w-2/3'>
						<ProductGallery product={product}/>
						<SectionList />
					</div>
					<div className='md:w-1/3 gap-2'>
						<ProductInfo product={product} />						
						<AllInfoProducts />
					</div>
					
				</div>
				
			</div>
		</div>
	)
}
