import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { productService } from '@/services/product.service'

import { IProductInput } from '@/shared/types/product.interface'

export const useUpdateProduct = () => {
	const params = useParams<{ productId: string }>()
	const queryClient = useQueryClient()

	const { mutate: updateProduct, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update product'],
		mutationFn: (data: IProductInput) => {
			if (params?.productId) {
				return productService.update(params.productId, data)
			} else {
				console.error("Product ID is missing")
				return Promise.reject(new Error("Product ID is missing"))
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get products for store dashboard']
			})
			toast.success('Product updated')
		},
		onError() {
			toast.error('Error updating product')
		}
	})

	return useMemo(
		() => ({ updateProduct, isLoadingUpdate }),
		[updateProduct, isLoadingUpdate]
	)
}
