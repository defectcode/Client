'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/form-elements/Input'

import { PUBLIC_URL } from '@/config/url.config'

export function SearchInput() {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [isSearchVisible, setSearchVisible] = useState<boolean>(false)

	const router = useRouter()

	return (
		<div className="flex items-center relative">
			{isSearchVisible && (
				<Input
					placeholder="Search for products"
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className="rounded-full px-4 py-2 focus-visible:ring-transparent"
				/>
			)}
			<Button
				variant="primary"
				onClick={() => {
					if (isSearchVisible && searchTerm) {
						// Redirect to search results
						router.push(PUBLIC_URL.explorer(`?searchTerm=${searchTerm}`))
					} else {
						// Toggle visibility of search input
						setSearchVisible(prev => !prev)
					}
				}}
				className="ml-2 rounded-full bg-black/20 text-white px-4 py-2"
			>
				Search
			</Button>
		</div>
	)
}
