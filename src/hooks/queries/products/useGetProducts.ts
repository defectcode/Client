import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { productService } from '@/services/product.service'

export const useGetProducts = () => {
    const params = useParams<{ storeId: string }>()

    const { data: products, isLoading } = useQuery({
        queryKey: ['get products for store dashboard'],
        queryFn: () => {
            if (params?.storeId) {
                return productService.getByStoreId(params.storeId)
            } else {
                console.error("Store ID is missing")
                return Promise.resolve([]) // sau altă valoare implicită
            }
        },
        enabled: !!params?.storeId // activează query-ul doar dacă storeId există
    })

    return useMemo(
        () => ({
            products,
            isLoading
        }),
        [products, isLoading]
    )
}
