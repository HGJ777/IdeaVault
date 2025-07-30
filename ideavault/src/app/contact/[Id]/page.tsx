// src/app/contact/[Id]/page.tsx - FIXED VERSION
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
  MessageSquare,
  CheckCircle,
  Lightbulb
} from 'lucide-react'

interface ContactFormData {
  subject: string
  message: string
  inquiryType: string
  budget: string
  timeline: string
  companyName: string
  contactEmail: string
}

export default function ContactIdeaPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [idea, setIdea] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // FIXED: Use capital Id instead of lowercase id
  const ideaId = params.Id as string

  const [formData, setFormData] = useState<ContactFormData>({
    subject: '',
    message: '',
    inquiryType: 'licensing',
    budget: '',
    timeline: '',
    companyName: '',
    contactEmail: user?.email || ''
  })

  useEffect(() => {
    if (ideaId && user) {
      fetchIdeaDetails()
    }
  }, [ideaId, user])

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, contactEmail: user.email || '' }))
    }
  }, [user])

  const fetchIdeaDetails = async () => {
    try {
      setLoading(true)
      setError('')

      console.log('🔍 Fetching idea for contact, ID:', ideaId)

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
      )

      // Fetch idea details
      const fetchPromise = supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        console.log('❌ Supabase error:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('Idea not found')
      }

      const ideaData = Array.isArray(data) ? data[0] : data

      // Check if idea allows contact
      if (!ideaData.allow_licensing) {
        throw new Error('This idea is not available for business inquiries')
      }

      // Check if trying to contact own idea
      if (user && ideaData.user_id === user.id) {
        throw new Error('You cannot contact yourself about your own idea')
      }

      // Check if idea is private and user is not owner
      if (ideaData.is_private && (!user || user.id !== ideaData.user_id)) {
        throw new Error('This idea is private and not available for contact')
      }

      setIdea(ideaData)
      
      // Auto-fill subject line
      setFormData(prev => ({
        ...prev,
        subject: `Business Inquiry: ${ideaData.title}`
      }))

    } catch (error: any) {
      console.log('❌ Error fetching idea:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      // Validation
      if (!formData.subject.trim()) {
        throw new Error('Subject is required')
      }
      if (!formData.message.trim()) {
        throw new Error('Message is required')
      }
      if (!formData.contactEmail.trim()) {
        throw new Error('Contact email is required')
      }

      // Insert the message into Supabase
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: idea.user_id,
          idea_id: ideaId,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          inquiry_type: formData.inquiryType,
          budget: formData.budget.trim() || null,
          timeline: formData.timeline.trim() || null,
          company_name: formData.companyName.trim() || null,
          contact_email: formData.contactEmail.trim(),
          status: 'sent'
        })
        .select()
        .single()

      if (error) {
        console.error('Error sending message:', error)
        throw new Error(error.message)
      }

      // Create notification for the idea owner
      if (messageData) {
        await supabase
          .from('notifications')
          .insert({
            user_id: idea.user_id,
            type: 'message',
            title: 'New Business Inquiry',
            message: `Someone sent you a business inquiry about "${idea.title}"`,
            related_id: messageData.id,
            related_type: 'message'
          })
      }

      setSuccess(true)
    } catch (error: any) {
      console.error('Error sending inquiry:', error)
      setError(error.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Loading idea details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Cannot Send Inquiry</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <Link
              href="/gallery"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={64} />
            <h1 className="text-3xl font-bold text-green-800 mb-4">Inquiry Sent Successfully!</h1>
            <p className="text-green-700 mb-6 text-lg">
              Your business inquiry has been sent to the idea creator. They will receive a notification and can respond to you directly.
            </p>
            
            <div className="bg-white p-6 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• The idea creator will receive your inquiry in their messages</li>
                <li>• They can review your business proposal and contact details</li>
                <li>• If interested, they'll respond directly to your email: {formData.contactEmail}</li>
                <li>• You can also check your messages here on IdeaVault for updates</li>
              </ul>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/messages"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Messages
              </Link>
              <Link
                href="/gallery"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Browse More Ideas
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <Link
            href={`/idea/${ideaId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Idea Details
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Send Business Inquiry</h1>
            <p className="text-gray-600 text-lg">
              Reach out to the creator about licensing, partnership, or investment opportunities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageSquare size={24} />
                    Your Inquiry
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief subject line for your inquiry"
                        required
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type of Inquiry *
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="licensing">Licensing Opportunity</option>
                        <option value="partnership">Partnership Proposal</option>
                        <option value="investment">Investment Interest</option>
                        <option value="acquisition">Acquisition Inquiry</option>
                        <option value="collaboration">Collaboration Request</option>
                        <option value="other">Other Business Opportunity</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Describe your business interest, proposal, or questions about this idea. Include relevant details about your company, timeline, and what you're offering..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Be specific about your intentions and what value you can provide.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Building size={24} />
                    Business Details
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range (Optional)
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Prefer to discuss</option>
                        <option value="under-10k">Under $10,000</option>
                        <option value="10k-50k">$10,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k-500k">$100,000 - $500,000</option>
                        <option value="500k-1m">$500,000 - $1,000,000</option>
                        <option value="over-1m">Over $1,000,000</option>
                      </select>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline (Optional)
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">No specific timeline</option>
                        <option value="immediate">Immediate (within 1 month)</option>
                        <option value="short-term">Short-term (1-3 months)</option>
                        <option value="medium-term">Medium-term (3-6 months)</option>
                        <option value="long-term">Long-term (6+ months)</option>
                      </select>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your company or organization name"
                      />
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email *
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Inquiry...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Business Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Idea Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb size={20} />
                  About This Idea
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{idea.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                      {idea.description.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Category: {idea.category}</p>
                    <p>Created: {new Date(idea.created_at).toLocaleDateString()}</p>
                    {idea.price && <p>Starting Price: ${idea.price}</p>}
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Tips for Success</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Be specific about your business intentions</li>
                  <li>• Explain what value you can provide</li>
                  <li>• Include relevant experience or credentials</li>
                  <li>• Be professional and respectful</li>
                  <li>• Provide clear contact information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}