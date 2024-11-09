import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { reviewService } from '@/services/review.service'

import { IReviewInput } from '@/shared/types/review.interface'

export const useCreateReview = (storeId: string) => {
	const params = useParams<{ id: string }>()
	const queryClient = useQueryClient()

	const { mutate: createReview, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['create review'],
		mutationFn: (data: IReviewInput) => {
			if (params?.id) {
				return reviewService.create(data, params.id, storeId)
			} else {
				console.error("Product ID is missing")
				return Promise.reject(new Error("Product ID is missing"))
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['product']
			})
			toast.success('Review created')
		},
		onError() {
			toast.error('Error creating review')
		}
	})

	return useMemo(
		() => ({
			createReview,
			isLoadingCreate
		}),
		[createReview, isLoadingCreate]
	)
}
