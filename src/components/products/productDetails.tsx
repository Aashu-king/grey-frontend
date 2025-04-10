import { useQuery } from '@tanstack/react-query'
import { Star, ChevronLeft, ShoppingCart, Heart, Share2, Check, Truck, Shield, AlertCircle, RefreshCw } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import ProductServiceInstance from '../../services/service/product.service'

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: {
    rate: number
    count: number
  }
}



export default function ProductDetail() {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { id } = useParams<{ id: string }>();
  const productIdNumber = Number(id);
  console.log('productIdNumber: ', productIdNumber);
  const { data: product, isLoading, isError, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => ProductServiceInstance.GetParticularProduct(productIdNumber),
  })

  const productImages = [
    product?.image,
    product?.image,
    product?.image,
    product?.image
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading product</h3>
              <div className="mt-2 text-sm text-red-700">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  <ChevronLeft className="inline h-4 w-4" /> Back to products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to products
        </button>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-gray-100 text-sm font-medium uppercase hover:bg-gray-50 ${
                      selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-contain object-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="aspect-h-1 aspect-w-1 w-full">
              <img
                src={productImages[selectedImage]}
                alt={product?.title}
                className="h-full w-full object-contain object-center sm:rounded-lg"
              />
            </div>
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product?.price}</p>
            </div>

            {product?.rating && (
              <div className="mt-3">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 flex-shrink-0 ${
                          product.rating!.rate > rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating.rate} out of 5 stars</p>
                  <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    {product.rating.count} reviews
                  </a>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700">
                <p>{product?.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <Check className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                <p className="ml-2 text-sm text-gray-500">In stock and ready to ship</p>
              </div>
            </div>

            <div className="mt-10 sm:flex sm:items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <div className="mt-4 sm:ml-4 sm:mt-0 flex space-x-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to cart
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center rounded-md px-4 py-3 text-gray-400 hover:text-gray-500"
                >
                  <Heart className="h-5 w-5 flex-shrink-0" />
                  <span className="sr-only">Add to favorites</span>
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center rounded-md px-4 py-3 text-gray-400 hover:text-gray-500"
                >
                  <Share2 className="h-5 w-5 flex-shrink-0" />
                  <span className="sr-only">Share</span>
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">Highlights</h2>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ul role="list">
                  <li>Premium quality materials</li>
                  <li>Designed for comfort and style</li>
                  <li>Environmentally friendly</li>
                  <li>1-year warranty included</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>
              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  Category: <span className="capitalize">{product?.category}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <section aria-labelledby="policies-heading" className="mt-10">
          <h2 id="policies-heading" className="sr-only">Our Policies</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Free shipping',
                description: 'Free delivery for all orders over $50',
                icon: Truck,
              },
              {
                name: '10-Day returns',
                description: 'Easy returns within 10 days of purchase',
                icon: RefreshCw,
              },
              {
                name: '1-year warranty',
                description: 'Hassle-free replacements',
                icon: Shield,
              },
            ].map((policy) => (
              <div key={policy.name} className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                <dt>
                  <policy.icon className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span className="mt-4 text-sm font-medium text-gray-900">{policy.name}</span>
                </dt>
                <dd className="mt-1 text-sm text-gray-500">{policy.description}</dd>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}