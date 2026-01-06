'use client'

import { Store, LayoutDashboard, Package, Receipt, Mic, TrendingUp, Bell, UserCircle } from 'lucide-react'

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  onNotificationClick: () => void
}

export default function Navbar({ activeSection, setActiveSection, onNotificationClick }: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'voice', label: 'Voice AI', icon: Mic },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Store className="w-7 h-7" />
          <span>Retail Boss</span>
          <span className="bg-primary text-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            AI-Powered
          </span>
        </div>
        
        <div className="hidden md:flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-primary text-secondary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
              </button>
            )
          })}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onNotificationClick}
            className="relative w-10 h-10 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105 overflow-hidden"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-danger text-white w-4.5 h-4.5 rounded-full text-xs font-semibold flex items-center justify-center">
              3
            </span>
          </button>
          <button className="w-10 h-10 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105 overflow-hidden">
            <UserCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

