// components/SuccessModal.tsx
import { CheckCircle2 } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function SuccessModal({ isOpen, onClose, message }: SuccessModalProps) {
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