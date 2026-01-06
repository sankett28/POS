'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'
import { IndianRupee, Package, Users, TrendingUp, Sparkles, AlertCircle, Calendar, Download, MoreVertical } from 'lucide-react'

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-primary mb-1">Dashboard Overview</h1>
          <p className="text-gray-500 text-base">Real-time insights for your business</p>
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary font-medium cursor-pointer transition-all hover:border-primary">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button className="bg-primary text-secondary border-none px-6 py-3 rounded-md font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-primary-light hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden">
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.5%
            </span>
          </div>
          <div className="text-[36px] font-bold text-primary mb-1">₹45,280</div>
          <div className="text-gray-600 text-sm font-medium mb-1">Today's Sales</div>
          <div className="text-gray-500 text-xs">vs ₹40,250 yesterday</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <Package className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              12 Low
            </span>
          </div>
          <div className="text-[36px] font-bold text-primary mb-1">248</div>
          <div className="text-gray-600 text-sm font-medium mb-1">Total Products</div>
          <div className="text-gray-500 text-xs">12 items need reorder</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +8.2%
            </span>
          </div>
          <div className="text-[36px] font-bold text-primary mb-1">1,247</div>
          <div className="text-gray-600 text-sm font-medium mb-1">Active Customers</div>
          <div className="text-gray-500 text-xs">89 new this week</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +15.3%
            </span>
          </div>
          <div className="text-[36px] font-bold text-primary mb-1">₹8.2L</div>
          <div className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</div>
          <div className="text-gray-500 text-xs">Target: ₹10L</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Sales Trend (Last 7 Days)</h3>
            <button className="w-8 h-8 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:scale-110">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="relative h-[300px] w-full">
            <Line data={salesData} options={salesOptions} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-primary">Top Selling Categories</h3>
            <button className="w-8 h-8 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:text-secondary hover:scale-110">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="relative h-[300px] w-full">
            <Pie data={categoryData} options={categoryOptions} />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-primary mb-6">
          <Sparkles className="w-5 h-5" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-primary mb-1">High Demand Alert</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Maggi noodles sales up 45% this week. Consider increasing stock by 30 units.</p>
            </div>
            <button className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105">
              Act Now
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-primary mb-1">Low Stock Warning</h4>
              <p className="text-sm text-gray-600 leading-relaxed">12 products below minimum level. Estimated stockout in 2-3 days.</p>
            </div>
            <button className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105">
              View Items
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4 items-start transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-primary">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0 transition-transform hover:scale-110 hover:rotate-[5deg]">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-primary mb-1">Festival Forecast</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Diwali in 15 days. AI predicts 60% increase in sweets & snacks demand.</p>
            </div>
            <button className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-primary font-semibold cursor-pointer transition-all hover:bg-primary hover:text-secondary hover:border-primary hover:scale-105">
              Prepare
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

