import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { STORE_URL } from '@/config/url.config'

import { colorService } from '@/services/color.service'

export const useDeleteColor = () => {
	const params = useParams<{ storeId: string; colorId: string }>()
	const router = useRouter()

	const queryClient = useQueryClient()

	const { mutate: deleteColor, isPending: isLoadingDelete } = useMutation({
		mutationKey: ['delete color'],
		mutationFn: () => {
			if (params?.colorId) {
				return colorService.delete(params.colorId);
			} else {
				console.error("Color ID is missing");
				return Promise.reject(new Error("Color ID is missing"));
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get colors for store dashboard']
			});
			toast.success('Color removed');
			if (params?.storeId) {
				router.push(STORE_URL.colors(params.storeId));
			} else {
				console.error("Store ID is missing");
			}
		},
		onError() {
			toast.error('Error while deleting color');
		}
	});	

	return useMemo(
		() => ({ deleteColor, isLoadingDelete }),
		[deleteColor, isLoadingDelete]
	)
}
