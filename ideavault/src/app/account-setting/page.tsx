// src/app/account-settings/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { Navigation } from '../components/Navigation'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { User, Camera, Save, Trash2 } from 'lucide-react'

export default function AccountSettings() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || '',
    company: user?.user_metadata?.company || ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
    if (isSuccess) setIsSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          company: formData.company
        }
      })

      if (error) throw error

      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)

    } catch (error: any) {
      setError(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              Account <span className="text-blue-600">Settings</span>
            </h1>
            <p className="text-xl text-gray-600">
              Manage your profile and personal information
            </p>
          </div>

          <div className="w-full px-2 max-w-4xl mx-auto space-y-6">
            {/* Profile Picture Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {formData.fullName?.[0] || formData.email?.[0] || 'U'}
                  </span>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Camera size={16} />
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              {/* Success Message */}
              {isSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">Profile updated successfully!</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/200 characters</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}