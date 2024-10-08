import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { PUBLIC_URL } from '@/config/url.config'

import { storeService } from '@/services/store.service'

export function useDeleteStore() {
	const params = useParams<{ storeId: string }>()
	const router = useRouter()

	const { mutate: deleteStore, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['delete store'],
		mutationFn: () => storeService.delete(params.storeId),
		onSuccess() {
			toast.success('The store has been removed.')
			router.push(PUBLIC_URL.home())
		},
		onError() {
			toast.error('Error deleting store')
		}
	})

	return useMemo(
		() => ({ deleteStore, isLoadingDelete }),
		[deleteStore, isLoadingDelete]
	)
}
