'use client'

import { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'
import { IndianRupee, Package, Users, TrendingUp, Sparkles, AlertCircle, Calendar, Download, MoreVertical, ChevronDown, Check } from 'lucide-react'
import ExportReportModal from './ExportReportModal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('Today')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const periods = ['Today', 'This Week', 'This Month']

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

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Sales (₹)',
      data: [32000, 35000, 38000, 36000, 40000, 45000, 42000],
      borderColor: '#000000',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointBackgroundColor: '#000000',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverRadius: 8
    }]
  }

  const categoryData = {
    labels: ['Groceries', 'Beverages', 'Snacks', 'Dairy', 'Others'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: ['#000000', '#333333', '#666666', '#999999', '#cccccc'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000000',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context: any) {
            return 'Sales: ₹' + context.parsed.y.toLocaleString('en-IN')
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₹' + (value/1000) + 'k'
          }
        },
        grid: { color: '#f5f5f5' }
      },
      x: {
        grid: { display: false }
      }
    }
  }

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: { size: 13 }
        }
      },
      tooltip: {
        backgroundColor: '#000000',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return context.label + ': ' + context.parsed + '%'
          }
        }
      }
    }
  }

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
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-primary text-secondary border-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden w-full sm:w-auto"
          >
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
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">₹45,280</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Today's Sales</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">vs ₹40,250 yesterday</div>
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
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">248</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Products</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">12 items need reorder</div>
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
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">1,247</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Active Customers</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">89 new this week</div>
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
          <div className="text-2xl sm:text-[36px] font-bold text-primary mb-1">₹8.2L</div>
          <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Monthly Revenue</div>
          <div className="text-gray-500 text-[10px] sm:text-xs">Target: ₹10L</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-primary">Sales Trend (Last 7 Days)</h3>
            <button className="w-7 h-7 sm:w-8 sm:h-8 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:scale-110">
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="relative h-[250px] sm:h-[300px] w-full">
            <Line data={salesData} options={salesOptions} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-primary">Top Selling Categories</h3>
            <button className="w-7 h-7 sm:w-8 sm:h-8 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:scale-110">
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="relative h-[250px] sm:h-[300px] w-full">
            <Pie data={categoryData} options={categoryOptions} />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-6 sm:mb-8">
        <h3 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-primary mb-4 sm:mb-6">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-primary mb-1">High Demand Alert</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.</p>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105 w-full sm:w-auto">
              Act Now
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-primary mb-1">Low Stock Warning</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">12 products below minimum level. Estimated stockout in 2-3 days.</p>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105 w-full sm:w-auto">
              View Items
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-semibold text-primary mb-1">Festival Forecast</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">Diwali in 15 days. AI predicts 60% increase in sweets & snacks demand.</p>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105 w-full sm:w-auto">
              Prepare
            </button>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedPeriod={selectedPeriod}
      />
    </section>
  )
}

