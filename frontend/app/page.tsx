'use client'

import { useState, useEffect } from 'react'
import Login from '@/components/Login'
import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'
import Inventory from '@/components/Inventory'
import Billing from '@/components/Billing'
import VoiceAI from '@/components/VoiceAI'
import Analytics from '@/components/Analytics'
import Profile from '@/components/Profile'
import Outreach from '@/components/Outreach'
import NotificationPanel from '@/components/NotificationPanel'
import SuccessModal from '@/components/SuccessModal'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [billData, setBillData] = useState<any>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2025-001')
  
  // Shared products state
  const [products, setProducts] = useState(() => {
    // Load from localStorage or use default products
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('products')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    // Default products
    return [
      { name: 'Maggi Noodles', price: 12, initial: 'M', category: 'Instant Food', sku: 'MAG001', stock: 45, minLevel: 20 },
      { name: 'Parle-G', price: 10, initial: 'P', category: 'Biscuits', sku: 'PAR002', stock: 8, minLevel: 15 },
      { name: 'Tata Tea', price: 250, initial: 'T', category: 'Beverages', sku: 'TEA003', stock: 32, minLevel: 25 },
      { name: 'Amul Butter', price: 55, initial: 'A', category: 'Dairy', sku: 'AMU004', stock: 3, minLevel: 10 },
    ]
  })

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products', JSON.stringify(products))
    }
  }, [products])

  const handleAddProduct = (newProduct: any) => {
    setProducts((prev: any[]) => [...prev, newProduct])
  }

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    setActiveSection('dashboard')
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onNotificationClick={() => setIsNotificationOpen(!isNotificationOpen)}
        onProfileClick={() => {
          setActiveSection('profile')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'inventory' && (
          <Inventory 
            products={products}
            onAddProduct={handleAddProduct}
          />
        )}
        {activeSection === 'billing' && (
          <Billing 
            products={products}
            onComplete={(data) => {
              setBillData(data)
              // Generate invoice number
              const date = new Date()
              const invNum = `INV-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
              setInvoiceNumber(invNum)
              setIsModalOpen(true)
            }} 
          />
        )}
        {activeSection === 'voice' && <VoiceAI />}
        {activeSection === 'outreach' && <Outreach />}
        {activeSection === 'analytics' && <Analytics />}
        {activeSection === 'profile' && <Profile onLogout={handleLogout} />}
      </main>

      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
      
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        billData={billData}
        invoiceNumber={invoiceNumber}
      />
    </div>
  )
}

