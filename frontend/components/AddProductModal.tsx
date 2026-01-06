'use client'

import { useState } from 'react'
import { X, Package, DollarSign, Hash, Tag, AlertCircle } from 'lucide-react'

interface Product {
  name: string
  price: number
  initial: string
  sku?: string
  category?: string
  stock?: number
  minLevel?: number
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Product) => void
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    sku: '',
    stock: '',
    minLevel: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const initial = formData.name.charAt(0).toUpperCase()
    const product: Product = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      initial,
      category: formData.category.trim(),
      sku: formData.sku.trim() || `SKU-${Date.now()}`,
      stock: formData.stock ? parseInt(formData.stock) : 0,
      minLevel: formData.minLevel ? parseInt(formData.minLevel) : 10
    }

    onAdd(product)
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      category: '',
      sku: '',
      stock: '',
      minLevel: ''
    })
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      sku: '',
      stock: '',
      minLevel: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-modal-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-primary text-secondary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Add New Product</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all hover:scale-105"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className={`w-full pl-11 pr-4 py-3 border rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Tag className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Groceries, Beverages"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.category && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              SKU (Optional)
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Hash className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Auto-generated if left empty"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Stock and Min Level Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Min Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Level
              </label>
              <input
                type="number"
                min="0"
                value={formData.minLevel}
                onChange={(e) => setFormData({ ...formData, minLevel: e.target.value })}
                placeholder="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white text-primary border border-gray-300 px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary hover:scale-[1.02]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-secondary border-none px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-primary-light hover:scale-[1.02] hover:shadow-lg"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

