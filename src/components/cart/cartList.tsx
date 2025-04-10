import { useState, useEffect } from 'react'
import { ShoppingCart, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../../context/auth.context'

export function CartList() {
  const { cartProducts } = useAuth()
  const [showNotification, setShowNotification] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = () => {
    setIsPlacingOrder(true)
    setTimeout(() => {
      setIsPlacingOrder(false)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 4000)
    }, 1500)
  }

  const calculateTotal = () => {
    return cartProducts?.reduce((total, product) => total + product.price, 0) || 0
  }

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 w-64">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Order Placed!</p>
                <p className="text-xs text-green-600 mt-1">Your order has been successfully placed.</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-green-400 hover:text-green-500 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Your Cart
        </h2>
      </div>
      
      {cartProducts && cartProducts.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
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
                  <p className="text-sm text-gray-500 mt-1">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      )}
    </div>
  )
}