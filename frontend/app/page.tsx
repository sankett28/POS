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
import NotificationPanel from '@/components/NotificationPanel'
import SuccessModal from '@/components/SuccessModal'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [billData, setBillData] = useState<any>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')

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

  const handleBillComplete = (billResponse: any) => {
    // billResponse should contain the bill data from backend
    setBillData(billResponse.bill || billResponse)
    setInvoiceNumber(billResponse.bill?.bill_number || billResponse.bill_number || '')
    setIsModalOpen(true)
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
        {activeSection === 'inventory' && <Inventory />}
        {activeSection === 'billing' && <Billing onComplete={handleBillComplete} />}
        {activeSection === 'voice' && <VoiceAI />}
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

