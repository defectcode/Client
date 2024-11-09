import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { STORE_URL } from '@/config/url.config'
import { categoryService } from '@/services/category.service'

export const useDeleteCategory = () => {
	const params = useParams<{ storeId: string; categoryId: string }>()
	const router = useRouter()
	const queryClient = useQueryClient()
	const categoryId = params?.categoryId
	const storeId = params?.storeId

	const { mutate: deleteCategory, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['delete category'],
		mutationFn: () => {
			if (!categoryId) {
				throw new Error("Category ID is required to delete a category.")
			}
			return categoryService.delete(categoryId)
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get categories for store dashboard']
			})
			toast.success('Category removed')
			if (storeId) {
				router.push(STORE_URL.categories(storeId))
			}
		},
		onError() {
			toast.error('Error deleting category')
		}
	})

	return useMemo(
		() => ({ deleteCategory, isLoadingDelete }),
		[deleteCategory, isLoadingDelete]
	)
}
