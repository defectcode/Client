import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { storeService } from '@/services/store.service'
import { IStoreEdit } from '@/shared/types/store.interface'

export function useUpdateStore() {
	const params = useParams<{ storeId: string }>()
	const queryClient = useQueryClient()

	const { data: store } = useQuery({
		queryKey: ['store', params?.storeId],
		queryFn: () => {
			if (params?.storeId) {
				return storeService.getById(params.storeId)
			} else {
				console.error("Store ID is missing")
				return Promise.reject(new Error("Store ID is missing"))
			}
		},
		enabled: !!params?.storeId, // rulează doar dacă storeId este definit
	})

	const { mutate: updateStore, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update store'],
		mutationFn: (data: IStoreEdit) => {
			if (params?.storeId) {
				return storeService.update(params.storeId, data)
			} else {
				console.error("Store ID is missing")
				return Promise.reject(new Error("Store ID is missing"))
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['profile']
			})
			toast.success('The store has been updated')
		},
		onError() {
			toast.error('Error updating store')
		}
	})

	return useMemo(
		() => ({ store, updateStore, isLoadingUpdate }),
		[store, updateStore, isLoadingUpdate]
	)
}
