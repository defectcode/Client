'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { useGetCategories } from '@/hooks/queries/categories/useGetCategories'
import { useGetColors } from '@/hooks/queries/colors/useGetColors'

import { productService } from '@/services/product.service'

import { ProductForm } from '../ProductForm'

export function ProductEdit() {
	const params = useParams<{ productId: string }>()

	const { data } = useQuery({
		queryKey: ['get product', params?.productId], // Add params.productId to the query key
		queryFn: () => (params?.productId ? productService.getById(params.productId) : Promise.reject('No productId')),
		enabled: !!params?.productId // Only run the query if productId is available
	})

	const { categories } = useGetCategories()
	const { colors } = useGetColors()

	return (
		<ProductForm
			product={data}
			categories={categories || []}
			colors={colors || []}
		/>
	)
}
