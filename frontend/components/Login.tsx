'use client'

import { useState } from 'react'
import { Store, Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Hardcoded credentials
    if (email === 'test@gmail.com' && password === '123456') {
      setIsLoading(false)
      onLogin()
    } else {
      setIsLoading(false)
      setError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Store className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <span className="text-2xl sm:text-3xl font-bold text-primary">Retail Boss</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-500">Log in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs sm:text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-md bg-white text-primary text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-secondary border-none px-6 py-3 rounded-md text-sm sm:text-base font-semibold cursor-pointer transition-all hover:bg-primary-light hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              Don't have an account?{' '}
              <button className="text-primary font-semibold hover:underline transition-all">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

