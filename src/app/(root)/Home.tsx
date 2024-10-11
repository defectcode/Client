import { Catalog } from '@/components/ui/catalog/Catalog'

import { PUBLIC_URL } from '@/config/url.config'

import { IProduct } from '@/shared/types/product.interface'

import { Hero } from './hero/Hero'

interface HomeProps {
	products: IProduct[]
}

export function Home({ products }: HomeProps) {
	return (
		<div>
			<Hero />
			<Catalog
				title='Bestsellers'
				description='The most popular products in our store.'
				linkTitle='Find out more'
				link={PUBLIC_URL.explorer()}
				products={products}
			/>
		</div>
	)
}
