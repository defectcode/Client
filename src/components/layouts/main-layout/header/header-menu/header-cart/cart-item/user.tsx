'use client'
import { useProfile } from '@/hooks/useProfile'
import { Loader } from '@/components/ui/Loader'
import { CreateStoreModal } from '@/components/ui/modals/CreateStoreModal'
import Link from 'next/link'
import Image from 'next/image'
import { DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config'
import { Button } from '@/components/ui/Button'

import styles from '../HeaderCart.module.scss'
import { LogOut } from 'lucide-react'



export function User() {
    const { user, isLoading } = useProfile()

    const currentPath = window.location.pathname;



    return (
        <Button className='bg-transparent hover:bg-[#F1F5F9]'>
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
							width={20}
							height={20}
							className={`${styles.avatar} ${currentPath === DASHBOARD_URL.home() ? 'border-2 border-white' : ''}`} // Iconiță activă
						/>
					</Link>
				</>
			) : (
				<Link href={PUBLIC_URL.auth()}>
					<button className='flex items-center justify-center text-[#7C788A]' >
						<LogOut className={`${styles.icon} ${currentPath === PUBLIC_URL.auth() ? 'text-white' : 'text-gray-300'}`} />
						Login
					</button>
				</Link>
			)}
        </Button>
    )

}
