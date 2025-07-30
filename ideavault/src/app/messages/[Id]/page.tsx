// src/app/messages/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../Context/AuthContext'
import { Navigation } from '../../components/Navigation'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { 
  ArrowLeft,
  Send,
  User,
  Building,
  Mail,
  Phone,
  Lightbulb,
  Clock,
  DollarSign,
  Archive,
  Flag,
  MoreHorizontal
} from 'lucide-react'

interface MessageThread {
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

// Remove all mock data - start fresh
export default function MessageConversationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [conversation, setConversation] = useState<MessageThread | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  const conversationId = params.id as string

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
    }
  }, [conversationId])

  const fetchConversation = async () => {
    try {
      setLoading(true)
      
      // Simplified query without ideas join to avoid relationship errors
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', conversationId)
        .eq('recipient_id', user?.id)
        .single()

      if (error) {
        console.error('Error fetching conversation:', error)
        throw error
      }

      if (!data) {
        setError('Conversation not found')
        return
      }

      setConversation(data)

    } catch (error: any) {
      setError(error.message || 'Failed to load conversation')
      console.error('Full error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setSending(true)
    try {
      // Update conversation status to replied
      const { error } = await supabase
        .from('messages')
        .update({ status: 'replied' })
        .eq('id', conversationId)
        .eq('recipient_id', user?.id)

      if (error) {
        console.error('Error updating message status:', error)
        throw error
      }

      // Update local state
      if (conversation) {
        setConversation({
          ...conversation,
          status: 'replied'
        })
      }

      setReplyMessage('')
      
      // In a real app, you might also insert a reply message
      console.log('Reply sent:', replyMessage)

    } catch (error: any) {
      setError(error.message || 'Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const markAsArchived = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'archived' })
        .eq('id', conversationId)
        .eq('recipient_id', user?.id)

      if (error) throw error

      if (conversation) {
        setConversation({
          ...conversation,
          status: 'archived'
        })
      }
    } catch (error) {
      console.error('Error archiving message:', error)
    }
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

  if (error || !conversation) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Conversation not found'}
            </h1>
            <p className="text-gray-600 mb-8">
              The conversation you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/messages"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Messages
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.push('/messages')}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Messages
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={markAsArchived}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Archive size={16} />
                Archive
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                <Flag size={16} />
                Report
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Conversation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Conversation Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {conversation.subject}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>
                            {new Date(conversation.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {conversation.inquiry_type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          conversation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          conversation.status === 'read' ? 'bg-gray-100 text-gray-800' :
                          conversation.status === 'replied' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6">
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {conversation.message}
                    </div>
                  </div>

                  {conversation.budget && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-green-600" size={18} />
                        <span className="font-semibold text-green-800">Proposed Budget:</span>
                        <span className="text-green-700">{conversation.budget}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section */}
                <div className="border-t border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Reply</h3>
                  <form onSubmit={handleSendReply}>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        Your reply will be sent to {conversation.contact_email}
                      </p>
                      <button
                        type="submit"
                        disabled={sending || !replyMessage.trim()}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sender Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {conversation.contact_email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {conversation.contact_email}
                      </h4>
                      {conversation.company_name && (
                        <p className="text-sm text-gray-600">{conversation.company_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="text-gray-400" size={16} />
                      <a 
                        href={`mailto:${conversation.contact_email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {conversation.contact_email}
                      </a>
                    </div>

                    {conversation.company_name && (
                      <div className="flex items-center gap-3">
                        <Building className="text-gray-400" size={16} />
                        <span className="text-gray-700">{conversation.company_name}</span>
                      </div>
                    )}
                  </div>

                  {/* Remove the bio section since we don't have sender_profile */}
                </div>
              </div>

              {/* Idea Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Idea</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Inquiry</h4>
                      <p className="text-sm text-gray-600">About your idea</p>
                    </div>
                  </div>

                  <Link
                    href={`/idea/${conversation.idea_id}`}
                    className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                  >
                    View Full Idea
                  </Link>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-gray-700">Schedule Call</span>
                  </button>
                  
                  <a
                    href={`mailto:${conversation.contact_email}`}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-gray-700">Send Direct Email</span>
                  </a>
                  
                  <button 
                    onClick={markAsArchived}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Archive className="text-gray-400" size={16} />
                    <span className="text-gray-700">Archive Conversation</span>
                  </button>
                </div>
              </div>

              {/* Business Tips */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Professional Tips</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Respond within 24-48 hours for best results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Be clear about your terms and expectations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Consider scheduling a call for complex discussions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Always maintain professional communication</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">•</span>
                    <span>Use this platform for initial contact, then move to direct email/calls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}