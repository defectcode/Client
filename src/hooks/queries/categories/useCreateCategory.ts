import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { STORE_URL } from '@/config/url.config'
import { categoryService } from '@/services/category.service'
import { ICategoryInput } from '@/shared/types/category.interface'

export const useCreateCategory = () => {
	const params = useParams<{ storeId: string }>()
	const router = useRouter()
	const queryClient = useQueryClient()
	const storeId = params?.storeId

	const { mutate: createCategory, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['create category'],
		mutationFn: (data: ICategoryInput) => {
			if (!storeId) {
				throw new Error("Store ID is required to create a category.")
			}
			return categoryService.create(data, storeId)
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get categories for store dashboard']
			})
			toast.success('Category created')
			if (storeId) {
				router.push(STORE_URL.categories(storeId))
			}
		},
		onError() {
			toast.error('Error creating category')
		}
	})

	return useMemo(
		() => ({
			createCategory,
			isLoadingCreate
		}),
		[createCategory, isLoadingCreate]
	)
}
