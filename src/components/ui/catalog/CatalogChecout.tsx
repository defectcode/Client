import Link from 'next/link'
import { ICatalog } from './catalog.interface'
import { ProductBag } from './product-card/ProductBag'

export function CatalogCheckout({
	title,
	description,
	linkTitle,
	link,
	products
}: ICatalog) {
	return (
		<div className="w-full flex justify-center bg-[#F9F9F9]">
			<div className="max-w-[1100px] w-full">
				<div className="md:md:flex md:items-center md:justify-between md:mb-4 md:mt-5 md:mx-5">
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
					<div className="md:mt-2 w-full flex flex-col gap-8">
						{products.length ? (
							products.map((product) => (
								<div className="w-full h-full " key={product.id}>
									<ProductBag product={product} />
								</div>
							))
						) : (
							<div>Nothing found</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
