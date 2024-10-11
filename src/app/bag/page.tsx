import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import  { Bag} from './Bag'

export const metadata: Metadata = {
	title: 'Featured',
	...NO_INDEX_PAGE
}

export default function FavoritesPage() {
	return <Bag />
}
