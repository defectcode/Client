import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { colorService } from '@/services/color.service'

import { IColorInput } from '@/shared/types/color.interface'

export const useUpdateColor = () => {
	const params = useParams<{ colorId: string }>()
	const queryClient = useQueryClient()

	const { mutate: updateColor, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update color'],
		mutationFn: (data: IColorInput) => {
			if (params?.colorId) {
				return colorService.update(params.colorId, data);
			} else {
				console.error("Color ID is missing");
				return Promise.reject(new Error("Color ID is missing"));
			}
		},
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['get colors for store dashboard']
			});
			toast.success('Color updated');
		},
		onError() {
			toast.error('Error updating color');
		}
	});
	

	return useMemo(
		() => ({ updateColor, isLoadingUpdate }),
		[updateColor, isLoadingUpdate]
	)
}
