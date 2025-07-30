// src/components/NotificationDropdown.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, X, Settings, MessageSquare, Eye, Mail, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../Context/AuthContext'

interface Notification {
  id: string
  type: 'message' | 'idea_view' | 'contact' | 'system'
  title: string
  message: string
  created_at: string
  read: boolean
  related_id?: string
  related_type?: string
}

export function NotificationDropdown() {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications()
    }
  }, [isOpen, user])

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

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false)

      if (error) throw error

      setNotifications(notifications.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        if (notification.related_id) {
          router.push(`/messages/${notification.related_id}`)
        } else {
          router.push('/messages')
        }
        break
      case 'contact':
        router.push('/messages')
        break
      case 'idea_view':
        if (notification.related_id) {
          router.push(`/idea/${notification.related_id}`)
        } else {
          router.push('/manage')
        }
        break
      default:
        break
    }

    setIsOpen(false)
  }

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />
      case 'contact':
        return <Mail size={16} className="text-green-500" />
      case 'idea_view':
        return <Eye size={16} className="text-purple-500" />
      case 'system':
        return <Settings size={16} className="text-gray-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications yet</p>
                <p className="text-sm">We'll notify you when something happens</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {timeAgo(notification.created_at)}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/notifications')
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}