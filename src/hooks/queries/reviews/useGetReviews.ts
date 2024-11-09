import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { reviewService } from '@/services/review.service'

export const useGetReviews = () => {
	const params = useParams<{ storeId: string }>()

	const { data: reviews, isLoading } = useQuery({
		queryKey: ['get reviews for store dashboard'],
		queryFn: () => {
			if (params?.storeId) {
				return reviewService.getByStoreId(params.storeId)
			} else {
				console.error("Store ID is missing")
				return Promise.reject(new Error("Store ID is missing"))
			}
		}
	})

	return useMemo(
		() => ({
			reviews,
			isLoading
		}),
		[reviews, isLoading]
	)
}
