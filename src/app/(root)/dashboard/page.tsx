import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Dashboard } from './Dashboard'

export const metadata: Metadata = {
	title: 'Personal account',
	...NO_INDEX_PAGE
}

export default function DashboardPage() {
	return <Dashboard />
}
