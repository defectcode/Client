import Link from 'next/link'
import { ICatalog } from './catalog.interface'
import { ProductCardCheckout } from './product-card/ProductCardCeckout'

export function CatalogCheckout({
	title,
	description,
	linkTitle,
	link,
	products
}: ICatalog) {
	return (
		<div className="w-full flex justify-center">
			<div className="max-w-[1400px] w-full">
				<div className="md:flex md:items-center md:justify-between mb-4 md:mt-5">
					<div className="max-w-2xl px-4 lg:max-w-full lg:px-0">
						<h1 className="text-2xl font-bold">{title}</h1>
						{description && (
							<p className="mt-2 text-sm text-muted-foreground">{description}</p>
						)}
					</div>
					{link && linkTitle && (
						<Link
							href={link}
							className="hidden text-sm font-medium text-blue-600 hover:text-blue-600/90 md:flex"
						>
							{linkTitle}
						</Link>
					)}
				</div>

				<div className="flex items-center w-full">
					<div className="mt-2 w-full flex flex-col gap-8">
						{products.length ? (
							products.map((product) => (
								<div className="w-full h-full " key={product.id}>
									<ProductCardCheckout product={product} />
								</div>
							))
						) : (
							<div>Нечего не найдено</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
