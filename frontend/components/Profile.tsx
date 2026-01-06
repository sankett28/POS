'use client'

import { useState } from 'react'
import { UserCircle, Settings, Lock, Bell, Shield, Database, CreditCard, Store, Mail, Phone, MapPin, Edit, Save, X, Camera, LogOut } from 'lucide-react'

interface ProfileProps {
  onLogout?: () => void
}

export default function Profile({ onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@retailboss.com',
    phone: '+91 98765 43210',
    storeName: 'Retail Boss Store',
    address: '123 Main Street, City, State - 123456',
    role: 'Administrator',
    joinDate: 'January 2024'
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowStockAlerts: true,
    salesReports: true,
    weeklyReports: true,
    twoFactorAuth: false
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values if needed
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  return (
    <section className="animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-[32px] font-bold text-primary mb-1">Admin Profile</h1>
        <p className="text-gray-500 text-sm sm:text-base">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-1 mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base flex-1 sm:flex-none ${
                  activeTab === tab.id
                    ? 'bg-primary text-secondary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary text-secondary flex items-center justify-center mx-auto mb-4">
                  <UserCircle className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-secondary flex items-center justify-center border-4 border-white hover:bg-primary-light transition-all">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">{profileData.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-2">{profileData.role}</p>
              <span className="inline-block px-3 py-1 bg-primary text-secondary rounded-full text-xs sm:text-sm font-semibold mb-4">
                {profileData.storeName}
              </span>
              <div className="text-xs sm:text-sm text-gray-500 mb-4">
                Member since {profileData.joinDate}
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 rounded-md bg-white text-red-600 text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-red-50 hover:border-red-400 hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-secondary rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-primary-light hover:scale-105"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-md">
                      <UserCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-primary">{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-md">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-primary">{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-md">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-primary">{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.storeName}
                      onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-md">
                      <Store className="w-5 h-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-primary">{profileData.storeName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Store Address</label>
                  {isEditing ? (
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  ) : (
                    <div className="flex items-start gap-3 px-4 py-2.5 bg-gray-50 rounded-md">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-primary">{profileData.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
              { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive updates via SMS', icon: Phone },
              { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Get notified when stock is low', icon: Bell },
              { key: 'salesReports', label: 'Daily Sales Reports', description: 'Receive daily sales summaries', icon: Database },
              { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly analytics reports', icon: Shield }
            ].map((setting) => {
              const Icon = setting.icon
              return (
                <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-primary text-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-primary mb-1">{setting.label}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{setting.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[setting.key as keyof typeof settings]}
                      onChange={(e) => setSettings({ ...settings, [setting.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-primary mb-6">Password & Security</h3>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:border-primary transition-all"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="bg-primary text-secondary border-none px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-primary-light hover:scale-105">
                Update Password
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-1">Two-Factor Authentication</h3>
                <p className="text-xs sm:text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-6">Billing Information</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-primary mb-1">Current Plan</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Premium Plan - ₹2,999/month</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-semibold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Billing Cycle</p>
                  <p className="text-sm sm:text-base font-semibold text-primary">Monthly</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Next Billing Date</p>
                  <p className="text-sm sm:text-base font-semibold text-primary">Feb 15, 2025</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-sm sm:text-base font-semibold text-primary">Credit Card •••• 4242</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 bg-primary text-secondary border-none px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-primary-light hover:scale-105">
                Upgrade Plan
              </button>
              <button className="flex-1 bg-white text-primary border border-gray-300 px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-gray-100 hover:border-primary">
                Manage Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

