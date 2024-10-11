'use client'

import { Header } from '@/components/layouts/main-layout/header/Header'
import { CatalogCheckout } from '@/components/ui/catalog/CatalogChecout'

import { useProfile } from '@/hooks/useProfile'

export function Bag() {
	const { user } = useProfile()

	if (!user) return null

	return (
		<div className='my-6'>
			<Header />
			<CatalogCheckout title='Featured' products={user.favorites} />
		</div>
	)
}

