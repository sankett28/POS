'use client'

import { useState, useMemo } from 'react'
import { PackageCheck, AlertTriangle, PackageX, TrendingUp, Scan, Plus, Search, Edit, ShoppingCart } from 'lucide-react'
import AddProductModal from './AddProductModal'

interface Product {
  name: string
  price: number
  initial: string
  category?: string
  sku?: string
  stock?: number
  minLevel?: number
}

interface InventoryProps {
  products: Product[]
  onAddProduct: (product: Product) => void
}

export default function Inventory({ products, onAddProduct }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Process products for inventory display
  const inventoryProducts = useMemo(() => {
    return products.map((product) => {
      const stock = product.stock || 0
      const minLevel = product.minLevel || 10
      let status = 'Good Stock'
      let forecast = 'Stable'
      let forecastIcon = TrendingUp
      let stockWarning = false
      let stockDanger = false

      if (stock < minLevel) {
        if (stock === 0 || stock < minLevel * 0.3) {
          status = 'Critical'
          forecast = 'Urgent!'
          forecastIcon = AlertTriangle
          stockDanger = true
        } else {
          status = 'Low Stock'
          forecast = 'Reorder now'
          forecastIcon = AlertTriangle
          stockWarning = true
        }
      } else if (stock > minLevel * 2) {
        forecast = 'High demand'
        forecastIcon = TrendingUp
      }

      return {
        ...product,
        stock,
        minLevel,
        status,
        forecast,
        forecastIcon,
        stockWarning,
        stockDanger
      }
    })
  }, [products])

  const filteredProducts = inventoryProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = activeFilter === 'All' ||
                         (activeFilter === 'Low Stock' && product.stock < product.minLevel) ||
                         (activeFilter === 'Expiring' && product.status === 'Critical')
    return matchesSearch && matchesFilter
  })

  // Calculate stats
  const stats = useMemo(() => {
    const inStock = inventoryProducts.filter(p => p.stock > 0).length
    const lowStock = inventoryProducts.filter(p => p.stock < p.minLevel && p.stock > 0).length
    const critical = inventoryProducts.filter(p => p.stock === 0 || p.stock < (p.minLevel || 10) * 0.3).length
    const stockValue = inventoryProducts.reduce((sum, p) => sum + (p.stock || 0) * (p.price || 0), 0)
    
    return { inStock, lowStock, critical, stockValue }
  }, [inventoryProducts])

  return (
    <section className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-bold text-primary mb-1">Smart Inventory Management</h1>
          <p className="text-gray-500 text-sm sm:text-base">AI-powered stock tracking & forecasting</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button className="bg-white text-primary border border-gray-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-gray-100 hover:border-primary hover:scale-[1.02] w-full sm:w-auto">
            <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
            Scan Barcode
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
          <PackageCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl sm:text-[28px] font-bold text-primary">{stats.inStock}</div>
            <div className="text-xs sm:text-sm text-gray-600">In Stock</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-warning flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl sm:text-[28px] font-bold text-primary">{stats.lowStock}</div>
            <div className="text-xs sm:text-sm text-gray-600">Low Stock</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
          <PackageX className="w-6 h-6 sm:w-8 sm:h-8 text-danger flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl sm:text-[28px] font-bold text-primary">{stats.critical}</div>
            <div className="text-xs sm:text-sm text-gray-600">Critical</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex items-center gap-2 sm:gap-4">
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-success flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xl sm:text-[28px] font-bold text-primary">
              ₹{stats.stockValue >= 100000 ? (stats.stockValue / 100000).toFixed(1) + 'L' : (stats.stockValue / 1000).toFixed(1) + 'k'}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Stock Value</div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 bg-gray-100 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md flex-1 sm:max-w-[400px]">
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent outline-none flex-1 text-xs sm:text-sm text-primary min-w-0"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Low Stock', 'Expiring'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-secondary border-primary'
                    : 'bg-white border-gray-300 hover:border-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Product</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Category</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Stock</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Min Level</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">AI Forecast</th>
                <th className="p-3 sm:p-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const ForecastIcon = product.forecastIcon
                return (
                  <tr
                    key={product.sku}
                    className="border-t border-gray-200 transition-all cursor-pointer hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-primary text-secondary flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0">
                          {product.name[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-primary truncate">{product.name}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">{product.category}</td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <span className={`font-semibold ${
                        product.stockWarning ? 'text-warning' : product.stockDanger ? 'text-danger' : 'text-primary'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">{product.minLevel}</td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                        product.status === 'Good Stock'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'Low Stock'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
                        <ForecastIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        {product.forecast}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      <button className="w-7 h-7 sm:w-8 sm:h-8 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:scale-110">
                        {product.status === 'Critical' || product.status === 'Low Stock' ? (
                          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddProduct}
      />
    </section>
  )
}

