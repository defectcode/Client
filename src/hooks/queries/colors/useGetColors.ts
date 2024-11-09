import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { colorService } from '@/services/color.service'

export const useGetColors = () => {
	const params = useParams<{ storeId: string }>()

	const { data: colors, isLoading } = useQuery({
		queryKey: ['get colors for store dashboard'],
		queryFn: () => {
			if (params?.storeId) {
				return colorService.getByStoreId(params.storeId);
			} else {
				console.error("Store ID is missing");
				return Promise.reject(new Error("Store ID is missing"));
			}
		}
	});	

	return useMemo(
		() => ({
			colors,
			isLoading
		}),
		[colors, isLoading]
	)
}
