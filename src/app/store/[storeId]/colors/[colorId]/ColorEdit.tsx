'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { colorService } from '@/services/color.service'

import { ColorForm } from '../ColorForm'

export function ColorEdit() {
	const params = useParams<{ colorId: string }>()

	const { data } = useQuery({
		queryKey: ['get color', params?.colorId], // Add params.colorId as part of the key for caching
		queryFn: () => (params ? colorService.getById(params.colorId) : Promise.reject('No colorId')),
		enabled: !!params?.colorId // Only run the query if colorId is available
	})

	return <ColorForm color={data} />
}
