'use client'

import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/Button'
import { Loader } from '@/components/ui/Loader'
import { CreateStoreModal } from '@/components/ui/modals/CreateStoreModal'

import { DASHBOARD_URL, PUBLIC_URL, STORE_URL } from '@/config/url.config'

import { useProfile } from '@/hooks/useProfile'

import styles from './HeaderMenu.module.scss'
import { HeaderCart } from './header-cart/HeaderCart'

export function HeaderMenu() {
	const { user, isLoading } = useProfile()

	// Folosim window.location.pathname pentru a determina ce pagină este activă
	const currentPath = window.location.pathname;

	return (
		<div className={styles.header_menu}>
			<HeaderCart />
			<div className='border-transparent h-[30px] flex items-center justify-around rounded-[10px] max-w-[317px] w-full bg-black/20 text-white'>
				<Link href={PUBLIC_URL.home()}>
					<Button variant='ghost' className={`border-transparent h-[26px] rounded-[10px] w-[103px] ${currentPath === PUBLIC_URL.home() ? 'bg-[#BBA5AF]/30 text-white font-bold' : 'bg-transparent text-white'}`}>
						Home
					</Button>
				</Link>
				<Link href={PUBLIC_URL.shop()}>
					<Button variant='ghost' className={`border-transparent h-[26px] rounded-[10px] w-[103px] ${currentPath === PUBLIC_URL.shop() ? ' text-white font-bold' : 'bg-transparent text-white'}`}>
						Shop
					</Button>
				</Link>
				<Link href={PUBLIC_URL.about()}>
					<Button variant='ghost' className={`border-transparent h-[26px] rounded-[10px] w-[103px] ${currentPath === PUBLIC_URL.about() ? 'bg-white/30 text-white font-bold' : 'bg-transparent text-white'}`}>
						About
					</Button>
				</Link>
			</div>
			{isLoading ? (
				<Loader size='sm' />
			) : user ? (
				<>
					<Link href={PUBLIC_URL.shop()}>
					</Link>
					{user.stores.length ? (
						<div>
						</div>
					) : (
						<CreateStoreModal>
							<Button variant='ghost'>Create a store</Button>
						</CreateStoreModal>
					)}
					<Link href={DASHBOARD_URL.home()}>
						<Image
							src={user.picture}
							alt={user.name}
							width={42}
							height={42}
							className={`${styles.avatar} ${currentPath === DASHBOARD_URL.home() ? 'border-2 border-white' : ''}`} // Iconiță activă
						/>
					</Link>
				</>
			) : (
				<Link href={PUBLIC_URL.auth()}>
					<Button variant='primary'>
						<LogOut className={`${styles.icon} ${currentPath === PUBLIC_URL.auth() ? 'text-white' : 'text-gray-300'}`} />
						Login
					</Button>
				</Link>
			)}
		</div>
	)
}
