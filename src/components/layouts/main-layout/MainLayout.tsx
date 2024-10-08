import { PropsWithChildren } from 'react'
import { Footer } from './footer/Footer'
import { Header } from './header/Header'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1">
				<Header />
				<main className="mx-5 lg:mx-14">{children}</main>
				<Footer />
			</div>
		</div>
	)
}
