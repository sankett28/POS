'use client'

import { useState } from 'react'
import { Store, LayoutDashboard, Package, Receipt, Mic, TrendingUp, Bell, UserCircle, Menu, X } from 'lucide-react'

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
  onNotificationClick: () => void
  onProfileClick: () => void
}

export default function Navbar({ activeSection, setActiveSection, onNotificationClick, onProfileClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'voice', label: 'Voice AI', icon: Mic },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-lg sm:text-xl text-primary">
            <Store className="w-5 h-5 sm:w-7 sm:h-7" />
            <span className="hidden sm:inline">Retail Boss</span>
            <span className="bg-primary text-secondary px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide">
              AI-Powered
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 flex-wrap">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-md font-medium transition-all text-sm lg:text-base ${
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
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onNotificationClick}
              className="relative w-9 h-9 sm:w-10 sm:h-10 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200 hover:scale-105"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-danger text-white w-5 h-5 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center border-2 border-white shadow-sm">
                3
              </span>
            </button>
            <button 
              onClick={onProfileClick}
              className={`hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 border-none rounded-md cursor-pointer items-center justify-center transition-all hover:scale-105 overflow-hidden ${
                activeSection === 'profile' 
                  ? 'bg-primary text-secondary' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-9 h-9 border-none bg-gray-100 rounded-md cursor-pointer flex items-center justify-center transition-all hover:bg-gray-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-gray-200">
            {/* Navigation Items */}
            <div className="flex flex-col gap-1 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all text-base ${
                      activeSection === item.id
                        ? 'bg-primary text-secondary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
            </div>
            
            {/* Profile Button for Mobile */}
            <button
              onClick={() => {
                onProfileClick()
                setIsMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all text-base ${
                activeSection === 'profile'
                  ? 'bg-primary text-secondary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              <UserCircle className="w-5 h-5" />
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

