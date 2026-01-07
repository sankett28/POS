'use client'

import { useState } from 'react'
import { X, Package, DollarSign, Hash, Tag, AlertCircle } from 'lucide-react'

interface Product {
  name: string
  selling_price: number
  sku?: string
  barcode?: string | null
  unit: string
  mrp?: number | null
  tax_rate?: number
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Product) => void
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    selling_price: '',
    sku: '',
    barcode: '',
    unit: 'piece',
    mrp: '',
    tax_rate: '0'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.selling_price || parseFloat(formData.selling_price) <= 0) {
      newErrors.selling_price = 'Valid selling price is required'
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required'
    }

    if (formData.mrp && parseFloat(formData.mrp) < 0) {
      newErrors.mrp = 'MRP cannot be negative'
    }

    if (formData.tax_rate && (parseFloat(formData.tax_rate) < 0 || parseFloat(formData.tax_rate) > 100)) {
      newErrors.tax_rate = 'Tax rate must be between 0 and 100'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const product: Product = {
      name: formData.name.trim(),
      selling_price: parseFloat(formData.selling_price),
      sku: formData.sku.trim() || `SKU-${Date.now()}`,
      barcode: formData.barcode.trim() || null,
      unit: formData.unit,
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      tax_rate: formData.tax_rate ? parseFloat(formData.tax_rate) : 0,
    }

    onAdd(product)
    
    // Reset form
    setFormData({
      name: '',
      selling_price: '',
      sku: '',
      barcode: '',
      unit: 'piece',
      mrp: '',
      tax_rate: '0'
    })
    setErrors({})
    // Don't close here - let parent handle success/error
  }

  const handleClose = () => {
    setFormData({
      name: '',
      selling_price: '',
      sku: '',
      barcode: '',
      unit: 'piece',
      mrp: '',
      tax_rate: '0'
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

          {/* Selling Price and MRP Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Selling Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selling Price (₹) <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                  placeholder="0.00"
                  className={`w-full pl-11 pr-4 py-3 border rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                    errors.selling_price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.selling_price && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.selling_price}
                </p>
              )}
            </div>

            {/* MRP */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                MRP (₹) (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
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

          {/* Barcode and Tax Rate Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Barcode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Barcode (Optional)
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Enter barcode"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tax Rate (%) (Optional)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.tax_rate}
                onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Unit selection, replacing Stock and Min Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Unit <span className="text-danger">*</span>
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="piece">Piece</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="liter">Liter</option>
              <option value="gram">Gram</option>
              <option value="pack">Pack</option>
            </select>
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

