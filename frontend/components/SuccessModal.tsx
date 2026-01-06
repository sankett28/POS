'use client'

import { CheckCircle, Printer, X } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 lg:p-12 max-w-[400px] w-full text-center animate-modal-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2">Bill Generated Successfully!</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Invoice #INV-2025-001 created</p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-primary border border-gray-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary hover:scale-[1.02]"
          >
            Close
          </button>
          <button className="flex-1 bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg">
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

