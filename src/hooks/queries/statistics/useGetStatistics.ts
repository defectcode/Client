import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { statisticsService } from '@/services/statistics.service'

export const useGetStatistics = () => {
	const params = useParams<{ storeId: string }>()

	const { data: main } = useQuery({
		queryKey: ['get main statistics'],
		queryFn: () => {
			if (params?.storeId) {
				return statisticsService.getMain(params.storeId)
			} else {
				console.error("Store ID is missing for main statistics")
				return Promise.reject(new Error("Store ID is missing"))
			}
		}
	})

	const { data: middle } = useQuery({
		queryKey: ['get middle statistics'],
		queryFn: () => {
			if (params?.storeId) {
				return statisticsService.getMiddle(params.storeId)
			} else {
				console.error("Store ID is missing for middle statistics")
				return Promise.reject(new Error("Store ID is missing"))
			}
		}
	})

	return useMemo(() => ({ main, middle }), [main, middle])
}
