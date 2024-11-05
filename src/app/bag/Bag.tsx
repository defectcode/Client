'use client'

import { Header } from '@/components/layouts/main-layout/header/Header'
import { CatalogCheckout } from '@/components/ui/catalog/CatalogChecout'

import { useProfile } from '@/hooks/useProfile'

export function Bag() {
	const { user } = useProfile()

	if (!user) return null

	return (
		<div className='bg-[#F9F9F9] md:py-6'>
			<Header/>
			<CatalogCheckout title='' products={user.favorites} />
		</div>
	)
}

