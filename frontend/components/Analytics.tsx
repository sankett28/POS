'use client'

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { TrendingUp, Calendar, Sunrise, Sunset } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Analytics() {
  const forecastData = {
    labels: ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Actual Sales',
        data: [45000, null, null, null, null, null, null],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 3,
        pointRadius: 8,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      },
      {
        label: 'AI Forecast',
        data: [45000, 47000, 49000, 48000, 52000, 58000, 55000],
        borderColor: '#666666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        borderDash: [8, 4],
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: '#666666',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2
      }
    ]
  }

  const peakHoursData = {
    labels: ['6-8 AM', '8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM', '6-8 PM', '8-10 PM'],
    datasets: [{
      label: 'Sales (₹)',
      data: [3500, 8500, 6000, 7500, 5000, 9000, 15200, 8000],
      backgroundColor: '#000000',
      borderRadius: 6,
      barThickness: 30
    }]
  }

  const forecastOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 15,
          font: { size: 13 },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#000000',
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN')
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

  const peakHoursOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.8,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000000',
        padding: 12,
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

  const customers = [
    { name: 'Ravi Kumar', purchases: 42, total: 12450, badge: 'VIP', badgeColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Priya Sharma', purchases: 38, total: 10200, badge: 'Regular', badgeColor: 'bg-gray-200 text-gray-700' },
    { name: 'Amit Patel', purchases: 35, total: 9800, badge: 'Regular', badgeColor: 'bg-gray-200 text-gray-700' },
  ]

  return (
    <section className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-primary mb-1">AI-Powered Analytics</h1>
        <p className="text-gray-500 text-base">Demand forecasting & business insights</p>
      </div>

      {/* Forecast Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-1">7-Day Demand Forecast</h3>
            <p className="text-gray-600 text-sm">AI predicts sales based on historical data & trends</p>
          </div>
          <div>
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold">
              92% Accurate
            </span>
          </div>
        </div>
        <div className="relative h-[300px] w-full mb-6">
          <Line data={forecastData} options={forecastOptions} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            <TrendingUp className="w-4.5 h-4.5 text-primary" />
            <span>Expected 18% increase on Saturday (weekend rush)</span>
          </div>
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
            <Calendar className="w-4.5 h-4.5 text-primary" />
            <span>Stock up 30% more for upcoming festival week</span>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-primary mb-6">Top Customers</h3>
          <div className="flex flex-col gap-4">
            {customers.map((customer, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                <div className="w-12 h-12 rounded-full bg-primary text-secondary flex items-center justify-center font-bold text-lg">
                  {customer.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-primary mb-1">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.purchases} purchases • ₹{customer.total.toLocaleString('en-IN')}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.badgeColor}`}>
                  {customer.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-primary mb-6">Peak Hours</h3>
          <div className="relative h-[300px] w-full mb-6">
            <Bar data={peakHoursData} options={peakHoursOptions} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
              <Sunrise className="w-4.5 h-4.5 text-primary" />
              <span>Morning: 8-10 AM (₹8,500 avg)</span>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
              <Sunset className="w-4.5 h-4.5 text-primary" />
              <span>Evening: 6-8 PM (₹15,200 avg)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

