// hooks/useCartMutation.ts
import { useMutation } from '@tanstack/react-query'
import axiosInstance from '../services/axios.setup'

interface CartProduct {
  productId: number
  quantity?: number
}

export const useAddToCart = () => {
  return useMutation({
    mutationFn: async (product: CartProduct) => {
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

      // Update the cart
      return axiosInstance.put('/carts/1', {
        userId: 1,
        products: updatedProducts
      })
    }
  })
}