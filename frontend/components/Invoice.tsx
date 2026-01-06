'use client'

import { Store } from 'lucide-react'

interface BillItem {
  name: string
  price: number
  quantity: number
  total: number
}

interface InvoiceProps {
  invoiceNumber: string
  billItems: BillItem[]
  subtotal: number
  gst: number
  total: number
  paymentMethod: string
  date: string
}

export default function Invoice({ invoiceNumber, billItems, subtotal, gst, total, paymentMethod, date }: InvoiceProps) {
  return (
    <div className="invoice-container bg-white p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-300">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">Retail Boss</h1>
            <p className="text-sm text-gray-600">AI-Powered POS System</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
          <p className="text-lg font-bold text-primary">{invoiceNumber}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-600 mb-1">Date</p>
            <p className="text-sm font-semibold text-primary">{date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Payment Method</p>
            <p className="text-sm font-semibold text-primary">{paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Item</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Qty</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Price</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-sm text-primary font-medium">{item.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">₹{item.price}</td>
                <td className="py-3 px-4 text-sm font-semibold text-primary text-right">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-primary">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (5%):</span>
              <span className="font-medium text-primary">₹{gst}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
              <span className="text-primary">Total:</span>
              <span className="text-primary">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500 mb-2">Thank you for your business!</p>
        <p className="text-xs text-gray-400">This is a computer-generated invoice</p>
      </div>

    </div>
  )
}

