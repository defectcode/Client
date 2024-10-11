import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Checkout } from './Checkout';

export const metadata: Metadata = {
	title: 'Checkout',
	...NO_INDEX_PAGE
}

export default function CheckoutPage() {
	return <Checkout />
}
