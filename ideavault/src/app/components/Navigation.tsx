// src/components/Navigation.tsx - CLEAN IDEAVAULT STYLE
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  CreditCard,
  DollarSign,
  Globe,
  Bell
} from 'lucide-react'

export function Navigation() {
  const { user, loading, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [publicIdeasCount, setPublicIdeasCount] = useState(0)
  const [monthlyCost, setMonthlyCost] = useState(0)

  useEffect(() => {
    if (user) {
      fetchBillingInfo()
    }
  }, [user])

  const fetchBillingInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('id')
        .eq('user_id', user?.id)
        .eq('is_private', false)

      if (error) throw error
      
      const count = data?.length || 0
      setPublicIdeasCount(count)
      setMonthlyCost(count * 1) // $1 per public idea
    } catch (error) {
      console.error('Error fetching billing info:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              IdeaVault
            </Link>
            <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-8 py-4">
        <div className="flex justify-between items-center w-full">
          {/* Left Side - Logo and Main Navigation */}
          <div className="flex items-center gap-12">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              IdeaVault
            </Link>
            
            {/* Main Navigation - Only show when authenticated */}
            {user && (
              <div className="flex items-center gap-12">
                <Link 
                  href="/gallery" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Browse
                </Link>
                <Link 
                  href="/create" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Create
                </Link>
                <Link 
                  href="/manage" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Manage
                </Link>
              </div>
            )}
          </div>
          
          {/* Right Side - Different for authenticated vs non-authenticated */}
          {user ? (
            // Authenticated User - Profile Dropdown with Billing
            <div className="flex items-center gap-6">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  {/* Profile Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.user_metadata?.full_name 
                      ? getInitials(user.user_metadata.full_name)
                      : user.email?.[0]?.toUpperCase() || '?'
                    }
                  </div>
                  
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.user_metadata?.full_name 
                              ? getInitials(user.user_metadata.full_name)
                              : user.email?.[0]?.toUpperCase() || '?'
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.user_metadata?.full_name || 'User'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Billing Overview */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <CreditCard size={16} className="text-blue-600" />
                            Billing Overview
                          </h4>
                          <Link
                            href="/billing"
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Manage
                          </Link>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                              <Globe size={14} />
                              Protected Ideas
                            </span>
                            <span className="font-medium text-gray-900">{publicIdeasCount}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 flex items-center gap-1">
                              <DollarSign size={14} />
                              Monthly Cost
                            </span>
                            <span className="font-bold text-gray-900">${monthlyCost.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {monthlyCost > 0 && (
                          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-800">
                              💡 Cancel protection anytime to stop billing
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User size={16} />
                          Profile Settings
                        </Link>
                        
                        <Link
                          href="/billing"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <CreditCard size={16} />
                          Billing & Subscriptions
                          {monthlyCost > 0 && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              ${monthlyCost}/mo
                            </span>
                          )}
                        </Link>
                        
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Bell size={16} />
                          Notifications
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          Account Settings
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Non-authenticated Navigation
            <>
              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-12">
                <Link 
                  href="/gallery" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Browse Ideas
                </Link>
                <Link 
                  href="/about" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  About Us
                </Link>
                <Link 
                  href="/how-it-works" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  How It Works
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Pricing
                </Link>
                <Link 
                  href="/support" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 font-semibold"
                >
                  Support
                </Link>
              </div>
              
              {/* Login/Signup Buttons */}
              <div className="flex items-center gap-6">
                <Link 
                  href="/login" 
                  className="px-6 py-2 text-gray-700 hover:text-blue-600 transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}