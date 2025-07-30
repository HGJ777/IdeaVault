// src/app/notifications/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '../components/Navigation'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { supabase } from '../lib/supabase'
import { useAuth } from '../Context/AuthContext'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Eye, 
  Settings,
  Save,
  Trash2
} from 'lucide-react'

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

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      messages: true,
      ideaViews: true,
      contact: true,
      system: true,
      weeklyDigest: true
    },
    push: {
      messages: true,
      ideaViews: false,
      contact: true,
      system: true
    }
  })

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

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

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) throw error

      setNotifications(notifications.filter(n => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

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
      console.error('Error marking all as read:', error)
    }
  }

  const handleToggle = (category: 'email' | 'push', setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !(prev[category] as any)[setting]
      }
    }))
    if (isSuccess) setIsSuccess(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    // In a real app, you'd save these settings to the database
    // For now, just simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSuccess(true)
    setIsLoading(false)
    setTimeout(() => setIsSuccess(false), 3000)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={18} className="text-blue-600" />
      case 'idea_view':
        return <Eye size={18} className="text-purple-600" />
      case 'contact':
        return <Mail size={18} className="text-green-600" />
      case 'system':
        return <Settings size={18} className="text-gray-600" />
      default:
        return <Bell size={18} className="text-gray-600" />
    }
  }

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

  const notificationTypes = [
    {
      id: 'messages',
      title: 'New Messages',
      description: 'When you receive business inquiries about your ideas',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: 'ideaViews',
      title: 'Idea Views',
      description: 'When someone views your ideas',
      icon: Eye,
      color: 'purple'
    },
    {
      id: 'contact',
      title: 'Contact Requests',
      description: 'When someone wants to contact you about your ideas',
      icon: Mail,
      color: 'green'
    },
    {
      id: 'system',
      title: 'System Updates',
      description: 'Important platform updates and security notifications',
      icon: Settings,
      color: 'gray'
    }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              <span className="text-blue-600">Notifications</span>
            </h1>
            <p className="text-xl text-gray-600">
              Manage your notifications and preferences
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Notifications List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Notifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                  {notifications.some(n => !n.read) && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="text-gray-400 mx-auto mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-600">We'll notify you when something happens with your ideas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          !notification.read 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {timeAgo(notification.created_at)}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2 ml-4">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete notification"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              {/* Success Message */}
              {isSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-600 font-medium">Notification preferences saved!</p>
                </div>
              )}

              {/* Notification Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Types</h3>

                <div className="space-y-6">
                  {notificationTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <div key={type.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${type.color}-100`}>
                            <IconComponent className={`text-${type.color}-600`} size={16} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{type.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 ml-11">
                          {/* Email Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Mail className="text-gray-400" size={14} />
                              <span className="text-sm text-gray-700">Email</span>
                            </div>
                            <button
                              onClick={() => handleToggle('email', type.id)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                (notificationSettings.email as any)[type.id]
                                  ? 'bg-blue-600'
                                  : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  (notificationSettings.email as any)[type.id]
                                    ? 'translate-x-5'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Push Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Smartphone className="text-gray-400" size={14} />
                              <span className="text-sm text-gray-700">Push</span>
                            </div>
                            <button
                              onClick={() => handleToggle('push', type.id)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                (notificationSettings.push as any)[type.id]
                                  ? 'bg-blue-600'
                                  : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  (notificationSettings.push as any)[type.id]
                                    ? 'translate-x-5'
                                    : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}