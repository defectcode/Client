'use client'

import {
	Album,
	BarChart,
	FolderKanban,
	PaintBucket,
	Settings,
	Star
} from 'lucide-react'
import { useParams } from 'next/navigation'

import { STORE_URL } from '@/config/url.config'

import { MenuItem } from './MenuItem'
import styles from './Navigation.module.scss'
import { IMenuItem } from './menu.interface'

export function Navigation() {
	const params = useParams<{ storeId: string }>()

	const storeId = params?.storeId ?? ''; // Use a fallback if storeId is undefined

	const routes: IMenuItem[] = [
		{
			icon: BarChart,
			link: STORE_URL.home(storeId),
			value: 'Statistics'
		},
		{
			icon: FolderKanban,
			link: STORE_URL.products(storeId),
			value: 'Goods'
		},
		{
			icon: Album,
			link: STORE_URL.categories(storeId),
			value: 'Categories'
		},
		{
			icon: PaintBucket,
			link: STORE_URL.colors(storeId),
			value: 'Colors'
		},
		{
			icon: Star,
			link: STORE_URL.reviews(storeId),
			value: 'Reviews'
		},
		{
			icon: Settings,
			link: STORE_URL.settings(storeId),
			value: 'Store settings'
		}
	]

	return (
		<div className={styles.wrapper}>
			<div className={styles.navigation}>
				{routes.map(route => (
					<MenuItem key={route.value} route={route} />
				))}
			</div>
		</div>
	)
}
