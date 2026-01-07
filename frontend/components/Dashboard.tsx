'use client'

import { useEffect, useRef, useState } from 'react'
import { IndianRupee, Package, Users, TrendingUp, AlertCircle, Download, ChevronDown, Check } from 'lucide-react'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const periods = ['Today', 'This Week', 'This Month']

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Use real data if available, otherwise show placeholders
  const salesToday = dashboardData?.sales?.today || 0
  const totalProducts = dashboardData?.products?.total || 0
  const lowStockCount = dashboardData?.products?.lowStock || 0
  const monthlyRevenue = dashboardData?.revenue?.monthly || 0

  return (
    <section className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-bold text-primary mb-1">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm sm:text-base">Real-time insights for your business</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base font-medium cursor-pointer transition-all hover:border-primary flex items-center justify-between gap-2 min-w-[140px]"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full sm:w-auto min-w-[140px] bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm sm:text-base font-medium cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      selectedPeriod === period
                        ? 'bg-primary text-secondary'
                        : 'text-primary hover:bg-gray-50'
                    }`}
                  >
                    <span>{period}</span>
                    {selectedPeriod === period && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden w-full sm:w-auto">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              +12.5%
            </span>
          </div>
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">₹{salesToday.toLocaleString('en-IN')}</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Today's Sales</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">
            {dashboardData?.sales?.trend ? `Trend: ${dashboardData.sales.trend > 0 ? '+' : ''}${dashboardData.sales.trend}%` : 'Loading...'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs font-semibold">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              12 Low
            </span>
          </div>
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">{totalProducts}</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Products</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">{lowStockCount} items need reorder</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              +8.2%
            </span>
          </div>
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">{dashboardData?.customers?.active || 0}</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Active Customers</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">
            {dashboardData?.customers?.newThisWeek || 0} new this week
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              +15.3%
            </span>
          </div>
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">
            ₹{monthlyRevenue >= 100000 ? (monthlyRevenue / 100000).toFixed(1) + 'L' : (monthlyRevenue / 1000).toFixed(1) + 'k'}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Monthly Revenue</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">
            {dashboardData?.revenue?.target ? `Target: ₹${(dashboardData.revenue.target / 100000).toFixed(1)}L` : 'Loading...'}
          </div>
        </div>
      </div>

    </section>
  )
}

