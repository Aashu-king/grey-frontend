import { createContext, useContext, useEffect, ReactNode } from 'react'
import axios from 'axios'
import axiosInstance from '../services/axios.setup'
import { useQuery } from '@tanstack/react-query'
import ProductServiceInstance from '../services/service/product.service'

interface CartProduct {
  productId: number
  quantity: number
}

interface CartItem {
  id: number
  userId: number
  date: string
  products: CartProduct[]
  __v: number
}

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

interface AuthContextType {
  getCartItem: (productId: number) => Promise<CartItem | null>
  cartProducts: Product[] | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const cartQuery = useQuery({
    queryKey: ['cart', 1],
    queryFn: () => getCartItem(1),
  })

  const allProductsQuery = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: () => ProductServiceInstance.GetProductList()
  })

  const cartProductIds = cartQuery.data?.products.map(p => p.productId) || []

  const cartProducts = allProductsQuery.data?.filter((product: Product) =>
    cartProductIds.includes(product.id)
  )

  console.log('cartProducts: ', cartProducts);


  useEffect(() => {
    getCartItem(1)
  }, [])

  const getCartItem = async (productId: number): Promise<CartItem | null> => {
    try {
      const response = await axiosInstance.get(`/carts/${productId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  const value: AuthContextType = {
    getCartItem,
    cartProducts,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
