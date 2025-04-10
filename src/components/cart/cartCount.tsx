import { useAuth } from '../../context/auth.context'

export function CartCount() {
  const { cartProducts } = useAuth()
  const count = cartProducts?.length || 0

  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  )
}