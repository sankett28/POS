'use client'

import { useState } from 'react'
import { Search, Scan, ShoppingBag, Wallet, Smartphone, CreditCard, CheckCircle, X } from 'lucide-react'

interface BillItem {
  name: string
  price: number
  quantity: number
  total: number
}

interface BillingProps {
  onComplete: () => void
}

export default function Billing({ onComplete }: BillingProps) {
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [subtotal, setSubtotal] = useState(0)
  const [gst, setGst] = useState(0)
  const [total, setTotal] = useState(0)

  const products = [
    { name: 'Maggi Noodles', price: 12, initial: 'M' },
    { name: 'Parle-G', price: 10, initial: 'P' },
    { name: 'Tata Tea', price: 250, initial: 'T' },
    { name: 'Amul Butter', price: 55, initial: 'A' },
  ]

  const addToBill = (name: string, price: number) => {
    setBillItems(prev => {
      const existingItem = prev.find(item => item.name === name)
      if (existingItem) {
        const updated = prev.map(item =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        )
        updateTotals(updated)
        return updated
      } else {
        const newItem = { name, price, quantity: 1, total: price }
        const updated = [...prev, newItem]
        updateTotals(updated)
        return updated
      }
    })
  }

  const updateTotals = (items: BillItem[]) => {
    const sub = items.reduce((sum, item) => sum + item.total, 0)
    const gstAmount = Math.round(sub * 0.05)
    const totalAmount = sub + gstAmount
    setSubtotal(sub)
    setGst(gstAmount)
    setTotal(totalAmount)
  }

  const clearBill = () => {
    setBillItems([])
    setSubtotal(0)
    setGst(0)
    setTotal(0)
  }

  const completeBilling = () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill first!')
      return
    }
    onComplete()
    setTimeout(() => {
      clearBill()
    }, 2000)
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-primary mb-1">Quick Billing</h1>
        <p className="text-gray-500 text-base">GST-compliant instant invoicing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 rounded-md mb-6">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search or scan product..."
              className="border-none bg-transparent outline-none flex-1 text-[15px]"
            />
            <button className="w-10 h-10 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105">
              <Scan className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.name}
                onClick={() => addToBill(product.name, product.price)}
                className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group"
              >
                <div className="w-[60px] h-[60px] rounded-md bg-primary text-secondary flex items-center justify-center font-bold text-2xl mx-auto mb-2 group-hover:bg-secondary group-hover:text-primary">
                  {product.initial}
                </div>
                <div className="font-semibold text-sm mb-1">{product.name}</div>
                <div className="font-bold text-base text-primary group-hover:text-secondary">₹{product.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky top-20 h-fit">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-primary">Current Bill</h3>
              <button
                onClick={clearBill}
                className="bg-transparent border-none text-gray-600 cursor-pointer font-medium px-2 py-1 transition-all hover:text-primary hover:scale-105"
              >
                Clear All
              </button>
            </div>

            <div className="min-h-[200px] max-h-[300px] overflow-y-auto mb-6">
              {billItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p>Add products to start billing</p>
                </div>
              ) : (
                <div>
                  {billItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 border-b border-gray-200 animate-slide-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-primary mb-1">{item.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                      <div className="font-bold text-primary">₹{item.total}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="py-6 border-t-2 border-gray-200 mb-6">
              <div className="flex justify-between mb-2 text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 text-xl font-bold text-primary">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {['Cash', 'UPI', 'Card'].map((method) => {
                const icons = { Cash: Wallet, UPI: Smartphone, Card: CreditCard }
                const Icon = icons[method as keyof typeof icons]
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border rounded-md cursor-pointer flex flex-col items-center gap-1 text-xs font-medium transition-all ${
                      paymentMethod === method
                        ? 'bg-primary text-secondary border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {method}
                  </button>
                )
              })}
            </div>

            <button
              onClick={completeBilling}
              className="w-full bg-primary text-secondary border-none px-6 py-3 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Complete & Print
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

