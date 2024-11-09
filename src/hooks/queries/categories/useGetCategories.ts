import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { categoryService } from '@/services/category.service'

export const useGetCategories = () => {
	const params = useParams<{ storeId: string }>()
	const storeId = params?.storeId

	const { data: categories, isLoading } = useQuery({
		queryKey: ['get categories for store dashboard', storeId],
		queryFn: () => {
			if (!storeId) {
				throw new Error("Store ID is required to fetch categories.")
			}
			return categoryService.getByStoreId(storeId)
		},
		enabled: !!storeId // Only run the query if storeId is available
	})

	return useMemo(
		() => ({
			categories,
			isLoading
		}),
		[categories, isLoading]
	)
}
