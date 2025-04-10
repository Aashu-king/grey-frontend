import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ShoppingCart, Star, Loader2, CheckCircle2, Search } from 'lucide-react'
import ProductServiceInstance from '../../services/service/product.service'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../services/axios.setup'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

interface CartProduct {
  productId: number
  quantity?: number
}

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductListing() {
  const navigate = useNavigate()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [addedProduct, setAddedProduct] = useState<string | null>(null)
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const { 
    data: products, 
    isLoading
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: ProductServiceInstance.GetProductList,
    staleTime: 1000 * 60 * 5
  })

  const filteredProducts = products?.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCartMutation = useMutation({
    mutationFn: async (product: CartProduct) => {
      setLoadingProductId(product.productId)
      try {
        const currentCart = await axiosInstance.get('/carts/1')
        
        const existingProducts = currentCart.data.products || []
        const existingProductIndex = existingProducts.findIndex(
          (p: CartProduct) => p.productId === product.productId
        )

        let updatedProducts
        if (existingProductIndex >= 0) {
          updatedProducts = [...existingProducts]
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: (updatedProducts[existingProductIndex].quantity || 1) + 1
          }
        } else {
          updatedProducts = [...existingProducts, { ...product, quantity: 1 }]
        }

        // Update cart
        return await axiosInstance.put('/carts/1', {
          userId: 1,
          products: updatedProducts
        })
      } finally {
        setLoadingProductId(null)
      }
    }
  })

  const openProduct = (id: number) => {
    navigate(`/products/${id}`)
  }

  const handleAddToCart = async (productId: number, productTitle: string) => {
    try {
      await addToCartMutation.mutateAsync({ productId })
      setAddedProduct(productTitle)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  return (
    <div className="bg-white">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={`${addedProduct} has been added to your cart!`}
      />

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        {/* Search Box */}
        <div className="relative mb-8 max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {filteredProducts?.length ? (
              filteredProducts.map((product) => {
                const isAdding = loadingProductId === product.id
                return (
                  <div key={product.id} className="group flex flex-col h-full">
                    <div 
                      className="w-full h-48 overflow-hidden rounded-lg bg-gray-200 cursor-pointer flex items-center justify-center"
                      onClick={() => openProduct(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain p-4 group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    
                    <div className="mt-4 flex-grow flex flex-col">
                      <div 
                        className="flex justify-between cursor-pointer"
                        onClick={() => openProduct(product.id)}
                      >
                        <div>
                          <h3 className="text-sm text-gray-700 line-clamp-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.rating.count})
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToCart(product.id, product.title)
                          }}
                          disabled={isAdding}
                          className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 gap-2 disabled:opacity-50"
                        >
                          {isAdding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {searchTerm ? "No products found matching your search." : "No products available."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}