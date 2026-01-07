'use client'

import { useState, useEffect } from 'react'
import { Search, Scan, ShoppingBag, Wallet, Smartphone, CreditCard, CheckCircle, X, AlertCircle } from 'lucide-react'

interface BillItem {
  product_id: string
  name: string
  price: number
  quantity: number
  total: number
}

interface Product {
  id: string
  name: string
  sku: string
  selling_price: number
  qty_on_hand: number
  unit: string
}

interface BillingProps {
  onComplete: (billResponse: any) => void
}

export default function Billing({ onComplete }: BillingProps) {
  const [billItems, setBillItems] = useState<BillItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [subtotal, setSubtotal] = useState(0)
  const [gst, setGst] = useState(0)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`)
      }
      
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter products based on search term and stock availability
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.qty_on_hand > 0 // Only show products in stock
  )

  const addToBill = (product: Product) => {
    setBillItems(prev => {
      const existingItem = prev.find(item => item.product_id === product.id)
      if (existingItem) {
        // Check if we can add more (stock check)
        const newQuantity = existingItem.quantity + 1
        if (newQuantity > product.qty_on_hand) {
          alert(`Only ${product.qty_on_hand} units available in stock`)
          return prev
        }
        const updated = prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
            : item
        )
        updateTotals(updated)
        return updated
      } else {
        // Add new item
        if (product.qty_on_hand < 1) {
          alert('Product out of stock')
          return prev
        }
        const newItem: BillItem = {
          product_id: product.id,
          name: product.name,
          price: product.selling_price,
          quantity: 1,
          total: product.selling_price
        }
        const updated = [...prev, newItem]
        updateTotals(updated)
        return updated
      }
    })
    setSearchTerm('') // Clear search after adding product
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromBill(productId)
      return
    }

    // Find product to check stock
    const product = products.find(p => p.id === productId)
    if (product && newQuantity > product.qty_on_hand) {
      alert(`Only ${product.qty_on_hand} units available in stock`)
      return
    }

    setBillItems(prev => {
      const updated = prev.map(item =>
        item.product_id === productId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      )
      updateTotals(updated)
      return updated
    })
  }

  const removeFromBill = (productId: string) => {
    setBillItems(prev => {
      const updated = prev.filter(item => item.product_id !== productId)
      updateTotals(updated)
      return updated
    })
  }

  const updateTotals = (items: BillItem[]) => {
    const sub = items.reduce((sum, item) => sum + item.total, 0)
    // Calculate GST (5% as per existing logic, but should come from product tax_rate)
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

  const completeBilling = async () => {
    if (billItems.length === 0) {
      alert('Please add items to the bill first!')
      return
    }

    if (processing) {
      return // Prevent double submission
    }

    try {
      setProcessing(true)
      setError(null)

      // Prepare sale data for backend
      // Backend calculates subtotal, tax, and total from product prices
      const saleData = {
        items: billItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        payment_mode: paymentMethod.toLowerCase()
      }

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || `Failed to create sale: ${response.statusText}`
        setError(errorMessage)
        alert(errorMessage)
        return // Don't clear cart on error
      }

      const result = await response.json()
      
      // Success - clear cart and show success modal
      clearBill()
      onComplete(result)
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to complete sale'
      setError(errorMessage)
      alert(errorMessage)
      console.error('Error completing sale:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <section className="animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-[32px] font-bold text-primary mb-1">Quick Billing</h1>
        <p className="text-gray-500 text-sm sm:text-base">GST-compliant instant invoicing</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 sm:gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md mb-4 sm:mb-6">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search or scan product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent outline-none flex-1 text-sm sm:text-[15px] min-w-0 text-primary"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="w-7 h-7 sm:w-8 sm:h-8 border-none bg-gray-200 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-300 hover:scale-105 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            )}
            <button className="w-9 h-9 sm:w-10 sm:h-10 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105 flex-shrink-0">
              <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToBill(product)}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3 sm:p-4 text-center cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group"
                >
                  <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-md bg-primary text-secondary flex items-center justify-center font-bold text-xl sm:text-2xl mx-auto mb-2 group-hover:bg-secondary group-hover:text-primary">
                    {product.name[0]}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm mb-1">{product.name}</div>
                  <div className="font-bold text-sm sm:text-base text-primary group-hover:text-secondary">₹{product.selling_price}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Stock: {product.qty_on_hand}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-50" />
              <p className="text-sm sm:text-base font-medium">No products found</p>
              <p className="text-xs sm:text-sm mt-1">Try searching with a different term</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Current Bill</h3>
              <button
                onClick={clearBill}
                className="bg-transparent border-none text-gray-600 cursor-pointer font-medium px-2 py-1 text-xs sm:text-sm transition-all hover:text-primary hover:scale-105"
              >
                Clear All
              </button>
            </div>

            <div className="min-h-[200px] max-h-[300px] overflow-y-auto mb-4 sm:mb-6">
              {billItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-400">
                  <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" />
                  <p className="text-xs sm:text-sm">Add products to start billing</p>
                </div>
              ) : (
                <div>
                  {billItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 animate-slide-in"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="font-semibold text-primary mb-1 text-sm sm:text-base truncate">{item.name}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-6 h-6 border border-gray-300 rounded text-xs hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-[10px] sm:text-xs text-gray-500">Qty: {item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-6 h-6 border border-gray-300 rounded text-xs hover:bg-gray-100"
                          >
                            +
                          </button>
                          <span className="text-[10px] sm:text-xs text-gray-500">× ₹{item.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-primary text-sm sm:text-base flex-shrink-0">₹{item.total}</div>
                        <button
                          onClick={() => removeFromBill(item.product_id)}
                          className="w-6 h-6 border border-red-300 rounded text-red-600 hover:bg-red-50 text-xs flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="py-4 sm:py-6 border-t-2 border-gray-200 mb-4 sm:mb-6">
              <div className="flex justify-between mb-2 text-xs sm:text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2 text-xs sm:text-sm">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-lg sm:text-xl font-bold text-primary">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-6">
              {['Cash', 'UPI', 'Card'].map((method) => {
                const icons = { Cash: Wallet, UPI: Smartphone, Card: CreditCard }
                const Icon = icons[method as keyof typeof icons]
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 sm:p-4 border rounded-md cursor-pointer flex flex-col items-center gap-1 text-[10px] sm:text-xs font-medium transition-all ${
                      paymentMethod === method
                        ? 'bg-primary text-secondary border-primary'
                        : 'bg-white border-gray-300 hover:border-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {method}
                  </button>
                )
              })}
            </div>

            <button
              onClick={completeBilling}
              disabled={processing || billItems.length === 0}
              className="w-full bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Complete & Print
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
