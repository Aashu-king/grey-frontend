// components/CartList.tsx
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '../../context/auth.context'


export function CartList() {
  const { cartProducts } = useAuth()

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Your Cart
        </h2>
      </div>
      
      {cartProducts && cartProducts.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {cartProducts.map((product) => (
            <div key={product.id} className="p-4 flex items-center">
              <img
                src={product.image}
                alt={product.title}
                className="h-16 w-16 object-contain rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  )
}

