// src/app/messages/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useAuth } from '../Context/AuthContext'
import { Navigation } from '../components/Navigation'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  User,
  Lightbulb,
  Mail,
  MailOpen,
  Send,
  Archive,
  Building,
  DollarSign
} from 'lucide-react'

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  idea_id: string
  subject: string
  message: string
  inquiry_type: string
  budget: string | null
  company_name: string | null
  contact_email: string
  status: 'sent' | 'read' | 'replied' | 'archived'
  created_at: string
}

// Remove the mock data completely - delete these lines
export default function MessagesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (user) {
      fetchMessages()
    }
  }, [user])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      
      // Simplified query without ideas join to avoid relationship errors
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching messages:', error)
        throw error
      }

      setMessages(data || [])
      setFilteredMessages(data || [])
    } catch (error: any) {
      setError(error.message || 'Failed to load messages')
      console.error('Full error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, statusFilter])

  const filterMessages = () => {
    let filtered = messages

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    setFilteredMessages(filtered)
  }

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'read' })
        .eq('id', messageId)
        .eq('recipient_id', user?.id)

      if (error) throw error

      setMessages(messages.map(msg => 
        msg.id === messageId && msg.status === 'sent' 
          ? { ...msg, status: 'read' as const }
          : msg
      ))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Mail className="text-blue-600" size={16} />
      case 'read':
        return <MailOpen className="text-gray-600" size={16} />
      case 'replied':
        return <Send className="text-green-600" size={16} />
      case 'archived':
        return <Archive className="text-gray-400" size={16} />
      default:
        return <Mail className="text-gray-400" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'read':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'replied':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'archived':
        return 'bg-gray-50 text-gray-500 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200'
    }
  }

  const statusCounts = {
    all: messages.length,
    sent: messages.filter(m => m.status === 'sent').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    archived: messages.filter(m => m.status === 'archived').length
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="w-full px-4 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
              <span className="text-blue-600">Messages</span>
            </h1>
            <p className="text-xl text-gray-600">
              Business inquiries and conversations about your ideas
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'All Messages', count: statusCounts.all, filter: 'all', color: 'bg-blue-50 text-blue-600' },
                { label: 'Unread', count: statusCounts.sent, filter: 'sent', color: 'bg-orange-50 text-orange-600' },
                { label: 'Read', count: statusCounts.read, filter: 'read', color: 'bg-gray-50 text-gray-600' },
                { label: 'Replied', count: statusCounts.replied, filter: 'replied', color: 'bg-green-50 text-green-600' },
                { label: 'Archived', count: statusCounts.archived, filter: 'archived', color: 'bg-gray-50 text-gray-500' }
              ].map((stat) => (
                <button
                  key={stat.filter}
                  onClick={() => setStatusFilter(stat.filter)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    statusFilter === stat.filter 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search messages, senders, or ideas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {filteredMessages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                    {filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'} found
                  </span>
                </div>
              )}
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="text-gray-400 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {messages.length === 0 ? 'No messages yet' : 'No messages found'}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {messages.length === 0 
                      ? 'Business inquiries about your ideas will appear here when people contact you.'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {messages.length === 0 && (
                    <div className="space-y-4">
                      <Link
                        href="/create"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Create Your First Idea
                      </Link>
                      <p className="text-sm text-gray-500">
                        Make sure your ideas are public and allow contact to receive inquiries
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        markAsRead(message.id)
                        router.push(`/messages/${message.id}`)
                      }}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        message.status === 'sent' ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {message.subject}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                              {getStatusIcon(message.status)}
                              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                              {message.inquiry_type}
                            </span>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <User size={14} />
                              <span className="font-medium">
                                {message.contact_email}
                              </span>
                              {message.company_name && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Building size={14} />
                                    <span>{message.company_name}</span>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Lightbulb size={14} />
                              <span>Idea inquiry</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>
                                {new Date(message.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {message.message}
                          </p>

                          {message.budget && (
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign size={14} className="text-green-600" />
                              <span className="text-green-600 font-medium">Budget: {message.budget}</span>
                            </div>
                          )}
                        </div>

                        <div className="ml-6 text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}