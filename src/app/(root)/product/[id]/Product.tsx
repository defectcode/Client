'use client'

import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services/product.service'
import { IProduct } from '@/shared/types/product.interface'
import { ProductGallery } from './prodcut-gallery/ProdcutGallery'
import { ProductInfo } from './product-info/ProductInfo'
import AllInfoProducts from './product-info/AllInfoProduct'
import { SectionList } from './product-info/FAQ'

interface ProductProps {
  initialProduct: IProduct
  similarProducts: IProduct[]
  id?: string
}

export function Product({
  initialProduct,
  similarProducts,
  id = ''
}: ProductProps) {
  const { data: product } = useQuery({
    queryKey: ['product', initialProduct.id],
    queryFn: () => productService.getById(id),
    initialData: initialProduct,
    enabled: !!id
  })

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="space-y-7 py-10 sm:px-6 md:px-0">
        <div className="lg:flex lg:items-start lg:gap-20">
          <div className="w-full lg:w-2/3">
            <ProductGallery product={product} />
            <div className="hidden lg:block mt-6">
              <SectionList />
            </div>
          </div>
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <ProductInfo product={product} />
            <AllInfoProducts />
          </div>
        </div>
        <div className="lg:hidden mt-6">
          <SectionList />
        </div>
      </div>
    </div>
  )
}
