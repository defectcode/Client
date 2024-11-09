import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { STORE_URL } from '@/config/url.config'

import { colorService } from '@/services/color.service'

import { IColorInput } from '@/shared/types/color.interface'

export const useCreateColor = () => {
	const params = useParams<{ storeId: string }>()
	const router = useRouter()

	const queryClient = useQueryClient()

	const { mutate: createColor, isPending: isLoadingCreate } = useMutation({
		mutationKey: ['create color'],
		mutationFn: (data: IColorInput) =>
			params?.storeId ? colorService.create(data, params.storeId) : Promise.reject(new Error('Store ID is missing')),		
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get colors for store dashboard']
			})
			toast.success('Color created')
			if (params?.storeId) {
				router.push(STORE_URL.colors(params.storeId));
			} else {
				console.error("Store ID is missing");
			}			
		},
		onError() {
			toast.error('Error creating color')
		}
	})

	return useMemo(
		() => ({
			createColor,
			isLoadingCreate
		}),
		[createColor, isLoadingCreate]
	)
}
