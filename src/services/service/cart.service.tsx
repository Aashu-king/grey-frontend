import axiosInstance from "../axios.setup";

interface CartItem {
    id: number
    productId: number
    title: string
    price: number
    image: string
    quantity: number
  }

class CartService {

     fetchCart = async (): Promise<CartItem[]> => {
        const response = await axiosInstance.get('/carts')
        console.log('response: ', response);
        return response.data
      }

     updateCartItem = async (data : { id: number; quantity: number }): Promise<CartItem> => {
        const response = await axiosInstance.post('/carts', data)
        console.log('response: ', response);
        return response.data
    }

     removeCartItem = async (id: number): Promise<void> => {
        const response = await axiosInstance.delete(`/carts/${id}`)
        console.log('response: ', response);
        return response.data
    }

}

const CartServiceInstance = new CartService()
export default CartServiceInstance;