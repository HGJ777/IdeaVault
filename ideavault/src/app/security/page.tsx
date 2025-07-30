// src/app/security/page.tsx
'use client'

import { useState } from 'react'
import { Navigation } from '../components/Navigation'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  AlertTriangle,
  Clock
} from 'lucide-react'

export default function SecurityPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [twoFactorEnabled] = useState(false) // This would come from user settings

  const sessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2025-01-23T10:30:00Z',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '2025-01-22T15:45:00Z',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on macOS',
      location: 'San Francisco, CA',
      lastActive: '2025-01-20T09:15:00Z',
      current: false
    }
  ]

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (isSuccess) setIsSuccess(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      setIsSuccess(true)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setTimeout(() => setIsSuccess(false), 3000)

    } catch (error: any) {
      setError(error.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              <span className="text-blue-600">Security</span> Settings
            </h1>
            <p className="text-xl text-gray-600">
              Manage your password and account security
            </p>
          </div>

          <div className="w-full px-2 max-w-4xl mx-auto space-y-6">
            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">Password updated successfully!</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              passwordStrength <= 2 ? 'bg-red-500' : 
                              passwordStrength <= 3 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          passwordStrength <= 2 ? 'text-red-600' : 
                          passwordStrength <= 3 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {passwordStrength <= 2 ? 'Weak' : 
                           passwordStrength <= 3 ? 'Medium' : 
                           'Strong'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                          {passwordData.newPassword.length >= 8 ? <Check size={12} /> : <X size={12} />}
                          8+ characters
                        </div>
                        <div className={`flex items-center gap-1 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[A-Z]/.test(passwordData.newPassword) ? <Check size={12} /> : <X size={12} />}
                          Uppercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[a-z]/.test(passwordData.newPassword) ? <Check size={12} /> : <X size={12} />}
                          Lowercase letter
                        </div>
                        <div className={`flex items-center gap-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[0-9]/.test(passwordData.newPassword) ? <Check size={12} /> : <X size={12} />}
                          Number
                        </div>
                        <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                          {/[^A-Za-z0-9]/.test(passwordData.newPassword) ? <Check size={12} /> : <X size={12} />}
                          Special character
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key size={16} />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${twoFactorEnabled ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Shield className={twoFactorEnabled ? 'text-green-600' : 'text-red-600'} size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {twoFactorEnabled 
                        ? 'Your account is protected with 2FA' 
                        : 'Add an extra layer of security to your account'
                      }
                    </p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  twoFactorEnabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
              </div>

              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Smartphone className="text-gray-600" size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{session.device}</h4>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{session.location}</p>
                        <p className="text-xs text-gray-400">
                          Last active: {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Sign Out All Other Sessions
                </button>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Security Alerts</h3>
              </div>

              <div className="text-center py-8 text-gray-500">
                <Shield className="mx-auto mb-3" size={48} />
                <p>No security alerts</p>
                <p className="text-sm">We'll notify you of any suspicious activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}