'use client'

import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/components/ui/Button'
import { SERVER_URL } from '@/config/api.config'
import styles from './Auth.module.scss'

export function Social() {
	const router = useRouter()

	return (
		<div className='space-y-3 w-full mt-5 flex justify-center items-center'>
			<Button
				variant='outline'
				onClick={() => router.push(`${SERVER_URL}/auth/google`)}
				className='gap-1'
			>
				<FcGoogle />
				Continue via Google
			</Button>
		</div>
	)
}
