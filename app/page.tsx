'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Dashboard from '@/components/Dashboard'
import Inventory from '@/components/Inventory'
import Billing from '@/components/Billing'
import VoiceAI from '@/components/VoiceAI'
import Analytics from '@/components/Analytics'
import NotificationPanel from '@/components/NotificationPanel'
import SuccessModal from '@/components/SuccessModal'

export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onNotificationClick={() => setIsNotificationOpen(!isNotificationOpen)}
      />
      
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'inventory' && <Inventory />}
        {activeSection === 'billing' && <Billing onComplete={() => setIsModalOpen(true)} />}
        {activeSection === 'voice' && <VoiceAI />}
        {activeSection === 'analytics' && <Analytics />}
      </main>

      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
      
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}

