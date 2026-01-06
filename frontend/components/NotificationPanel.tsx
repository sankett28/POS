'use client'

import { X, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const notifications = [
    {
      icon: AlertTriangle,
      title: 'Low Stock Alert',
      text: 'Parle-G Biscuits: Only 8 units left',
      time: '2 minutes ago',
      unread: true
    },
    {
      icon: TrendingUp,
      title: 'High Demand Detected',
      text: 'Maggi sales up 45% - consider restocking',
      time: '1 hour ago',
      unread: true
    },
    {
      icon: Calendar,
      title: 'Festival Reminder',
      text: 'Diwali in 15 days - prepare inventory',
      time: '3 hours ago',
      unread: false
    },
  ]

  return (
    <div
      className={`fixed top-16 right-0 w-full sm:w-[400px] h-[calc(100vh-64px)] bg-white border-l border-gray-200 shadow-xl transition-all z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold text-primary">Notifications</h3>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-gray-600 cursor-pointer font-medium px-2 py-1 transition-all hover:text-primary hover:scale-105"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-64px)]">
        {notifications.map((notification, index) => {
          const Icon = notification.icon
          return (
            <div
              key={index}
              className={`p-4 sm:p-6 border-b border-gray-200 flex gap-3 sm:gap-4 cursor-pointer transition-all hover:bg-gray-50 ${
                notification.unread ? 'bg-gray-50' : ''
              }`}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-primary flex items-center justify-center text-secondary flex-shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary mb-1 text-sm sm:text-base">{notification.title}</div>
                <div className="text-xs sm:text-sm text-gray-600 mb-1">{notification.text}</div>
                <div className="text-[10px] sm:text-xs text-gray-500">{notification.time}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

