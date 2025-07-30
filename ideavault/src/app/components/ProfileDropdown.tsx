// src/components/ProfileDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../Context/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Shield,
  Bell
} from 'lucide-react'

interface ProfileDropdownProps {
  onProfileClick?: () => void
}

export function ProfileDropdown({ onProfileClick }: ProfileDropdownProps) {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
    router.push('/')
  }

  const handleProfileCircleClick = () => {
    if (onProfileClick) {
      onProfileClick() // Navigate to browse/explore
      setIsOpen(false)
    } else {
      setIsOpen(!isOpen) // Default behavior - toggle dropdown
    }
  }

  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'
  const userName = user?.user_metadata?.full_name || user?.email || 'User'
  const userEmail = user?.email || ''

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={handleProfileCircleClick}
        onContextMenu={(e) => {
          e.preventDefault()
          setIsOpen(!isOpen) // Right-click to open dropdown
        }}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors group"
        title="Click to browse ideas, right-click for menu"
      >
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
          <span className="text-white font-semibold text-sm">
            {userInitial}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen) // Clicking the chevron always opens dropdown
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {userInitial}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="py-2">
            <Link
              href="/gallery"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={18} className="text-gray-400" />
              <div>
                <div className="font-medium">Browse Ideas</div>
                <div className="text-xs text-gray-500">Discover amazing ideas from creators</div>
              </div>
            </Link>

            <Link
              href="/account-setting"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
              <div>
                <div className="font-medium">Account Settings</div>
                <div className="text-xs text-gray-500">Manage your account preferences</div>
              </div>
            </Link>

            <Link
              href="/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard size={18} className="text-gray-400" />
              <div>
                <div className="font-medium">Billing & Subscription</div>
                <div className="text-xs text-gray-500">Manage your premium plan</div>
              </div>
            </Link>

            <Link
              href="/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield size={18} className="text-gray-400" />
              <div>
                <div className="font-medium">Security</div>
                <div className="text-xs text-gray-500">Password and 2FA settings</div>
              </div>
            </Link>

            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Bell size={18} className="text-gray-400" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-xs text-gray-500">Email and push preferences</div>
              </div>
            </Link>
          </div>

          {/* Secondary Actions */}
          <div className="border-t border-gray-100 py-2">
            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HelpCircle size={18} className="text-gray-400" />
              <span className="font-medium">Help & Support</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>IdeaVault v2.0</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}