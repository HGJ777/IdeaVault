// src/app/create/page.tsx - WITH STRIPE INTEGRATION
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { Navigation } from '../components/Navigation'
import { StripeCheckout, StripeSuccessModal } from '../components/StripeCheckout'
import { 
  Plus, 
  X, 
  Lock, 
  Globe, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Eye,
} from 'lucide-react'

interface IdeaFormData {
  summary: string
  problem: string
  solution: string
  target_audience: string
  unique_value: string
  future_plans: string
  detailed_description: string
  categories: string[]
  is_private: boolean
}

export default function CreatePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  // Privacy modal state
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(false)
  const [pendingPrivacyChange, setPendingPrivacyChange] = useState<boolean | null>(null)
  
  // Stripe checkout state
  const [showStripeCheckout, setShowStripeCheckout] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdIdeaId, setCreatedIdeaId] = useState<string | null>(null)

  const [formData, setFormData] = useState<IdeaFormData>({
    summary: '',
    problem: '',
    solution: '',
    target_audience: '',
    unique_value: '',
    future_plans: '',
    detailed_description: '',
    categories: [],
    is_private: true
  })

  const availableCategories = [
    'Technology', 'Finance', 'Education', 'Sustainability', 'Health & Fitness',
    'Entertainment', 'E-commerce', 'Marketing', 'Real Estate', 'Food & Beverage',
    'Transportation', 'Fashion', 'Travel', 'Gaming', 'Social Media', 'Productivity', 'Other'
  ]

  const prompts = [
    {
      key: 'summary' as keyof IdeaFormData,
      label: 'What is your idea?',
      placeholder: 'Give a clear, concise summary of your core idea...',
      required: true,
      limit: 300,
      description: 'One-sentence summary that captures the essence'
    },
    {
      key: 'problem' as keyof IdeaFormData,
      label: 'What problem does it solve?',
      placeholder: 'Describe the specific problem or pain point your idea addresses...',
      required: true,
      limit: 500,
      description: 'Be specific about the problem and why it matters'
    },
    {
      key: 'solution' as keyof IdeaFormData,
      label: 'How does it work?',
      placeholder: 'Explain the core mechanism, process, or approach of your solution...',
      required: true,
      limit: 500,
      description: 'Focus on the key functionality and user experience'
    },
    {
      key: 'target_audience' as keyof IdeaFormData,
      label: 'Who is it for?',
      placeholder: 'Define your target audience, users, or customers...',
      required: true,
      limit: 250,
      description: 'Be specific about demographics, use cases, or market segments'
    },
    {
      key: 'unique_value' as keyof IdeaFormData,
      label: 'What makes it unique?',
      placeholder: 'Describe your competitive advantage or what sets it apart...',
      required: true,
      limit: 500,
      description: 'Highlight your differentiators and value proposition'
    },
    {
      key: 'future_plans' as keyof IdeaFormData,
      label: 'Future features or expansion plans?',
      placeholder: 'Any additional features, improvements, or expansion ideas...',
      required: false,
      limit: 500,
      description: 'Optional: Share your vision for growth and evolution'
    }
  ]

  const handlePrivacyChange = (newPrivacyValue: boolean) => {
    if (!newPrivacyValue) {
      // User wants to make it public - show warning modal
      setShowPrivacyWarning(true)
      setPendingPrivacyChange(newPrivacyValue)
    } else {
      // User wants to make it private - no warning needed
      setFormData(prev => ({ ...prev, is_private: newPrivacyValue }))
    }
  }

  const confirmPrivacyChange = () => {
    if (pendingPrivacyChange !== null) {
      setFormData(prev => ({ ...prev, is_private: pendingPrivacyChange }))
    }
    setShowPrivacyWarning(false)
    setPendingPrivacyChange(null)
  }

  const cancelPrivacyChange = () => {
    setShowPrivacyWarning(false)
    setPendingPrivacyChange(null)
  }

  const handleInputChange = (field: keyof IdeaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (success) setSuccess('')
  }

  const addCategory = (category: string) => {
    if (!formData.categories.includes(category) && formData.categories.length < 5) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }))
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }))
  }

  const getCharacterCount = (field: keyof IdeaFormData) => {
    return String(formData[field] || '').length
  }

  const isFieldValid = (field: keyof IdeaFormData, limit: number, required: boolean) => {
    const value = String(formData[field] || '')
    if (required && !value.trim()) return false
    if (value.length > limit) return false
    return true
  }

  const validateForm = () => {
    // Check required prompts
    for (const prompt of prompts) {
      if (prompt.required && !isFieldValid(prompt.key, prompt.limit, prompt.required)) {
        return false
      }
    }
    
    // Check categories
    if (formData.categories.length === 0) {
      return false
    }
    
    return true
  }

  const createPrivateIdea = async () => {
    const structuredDescription = `
**What is your idea?**
${formData.summary}

**What problem does it solve?**
${formData.problem}

**How does it work?**
${formData.solution}

**Who is it for?**
${formData.target_audience}

**What makes it unique?**
${formData.unique_value}

${formData.future_plans ? `**Future features or expansion plans?**
${formData.future_plans}

` : ''}${formData.detailed_description ? `**Additional Details:**
${formData.detailed_description}` : ''}
    `.trim()

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: formData.summary.substring(0, 100),
        description: structuredDescription,
        category: formData.categories[0],
        tags: formData.categories,
        is_private: true,
        billing_status: null,
        user_id: user?.id,
        views: 0,
        allow_licensing: false,
        price: null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const createPublicIdea = async () => {
    const structuredDescription = `
**What is your idea?**
${formData.summary}

**What problem does it solve?**
${formData.problem}

**How does it work?**
${formData.solution}

**Who is it for?**
${formData.target_audience}

**What makes it unique?**
${formData.unique_value}

${formData.future_plans ? `**Future features or expansion plans?**
${formData.future_plans}

` : ''}${formData.detailed_description ? `**Additional Details:**
${formData.detailed_description}` : ''}
    `.trim()

    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: formData.summary.substring(0, 100),
        description: structuredDescription,
        category: formData.categories[0],
        tags: formData.categories,
        is_private: false,
        billing_status: 'pending',
        user_id: user?.id,
        views: 0,
        allow_licensing: false,
        price: null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!validateForm()) {
        throw new Error('Please fill in all required fields and select at least one category')
      }

      if (formData.is_private) {
        // Create private idea immediately
        await createPrivateIdea()
        setSuccess('Private idea saved successfully!')
        
        // Reset form
        setFormData({
          summary: '',
          problem: '',
          solution: '',
          target_audience: '',
          unique_value: '',
          future_plans: '',
          detailed_description: '',
          categories: [],
          is_private: true
        })

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/manage'
        }, 2000)

      } else {
        // Create public idea and show Stripe checkout
        const idea = await createPublicIdea()
        setCreatedIdeaId(idea.id)
        setShowStripeCheckout(true)
      }

    } catch (error: any) {
      console.error('Error creating idea:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStripeSuccess = () => {
    setShowStripeCheckout(false)
    setShowSuccessModal(true)
  }

  const handleStripeCancel = async () => {
    // Delete the pending idea if payment was cancelled
    if (createdIdeaId) {
      await supabase
        .from('ideas')
        .delete()
        .eq('id', createdIdeaId)
    }
    
    setShowStripeCheckout(false)
    setCreatedIdeaId(null)
    setError('Payment cancelled. Idea was not published.')
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    
    // Reset form
    setFormData({
      summary: '',
      problem: '',
      solution: '',
      target_audience: '',
      unique_value: '',
      future_plans: '',
      detailed_description: '',
      categories: [],
      is_private: true
    })
    
    // Redirect to manage page
    window.location.href = '/manage'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        
        <div className="flex-1 w-full px-8 py-8">
          {/* Header - DYNAMIC BASED ON PRIVACY */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 mb-6 ${
              formData.is_private 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              {formData.is_private ? <Lock className="text-green-600" size={24} /> : <Globe className="text-blue-600" size={24} />}
              <h1 className={`text-3xl font-bold ${
                formData.is_private ? 'text-green-900' : 'text-blue-900'
              }`}>
                {formData.is_private ? 'Free Idea Storage' : 'Secure Idea Protection'}
              </h1>
            </div>
            <p className={`text-xl font-bold ${
              formData.is_private ? 'text-green-700' : 'text-blue-700'
            }`}>
              {formData.is_private 
                ? '💚 FREE storage • Private dashboard access only'
                : '💙 $1.00 per month per idea • Includes timestamping & IP protection'
              }
            </p>
            
            {/* Example Button */}
            <div className="mt-6">
              <Link
                href="/example"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold border border-gray-200"
              >
                <Eye size={20} />
                View Example Idea
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-bold">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <span className="text-red-800 font-bold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Guided Prompts */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Lightbulb className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">Guided Idea Builder</h2>
                </div>
              </div>
              
              <div className="space-y-8">
                {prompts.map((prompt, index) => (
                  <div key={prompt.key}>
                    <label className="block text-lg font-bold text-gray-900 mb-2">
                      {prompt.label}
                      {prompt.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <p className="text-sm text-gray-600 mb-3 font-medium">{prompt.description}</p>
                    
                    <div className="relative">
                      <textarea
                        value={String(formData[prompt.key] || '')}
                        onChange={(e) => handleInputChange(prompt.key, e.target.value)}
                        rows={3}
                        maxLength={prompt.limit}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-gray-900 ${
                          prompt.required && !isFieldValid(prompt.key, prompt.limit, prompt.required)
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300'
                        }`}
                        placeholder={prompt.placeholder}
                        required={prompt.required}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div></div>
                        <p className={`text-sm font-medium ${
                          getCharacterCount(prompt.key) > prompt.limit * 0.9 
                            ? 'text-orange-600' 
                            : 'text-gray-500'
                        }`}>
                          {getCharacterCount(prompt.key)}/{prompt.limit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Optional Detailed Description */}
                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-lg font-bold text-gray-900 mb-2">
                    Additional Details (Optional)
                  </label>
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Add any extra information, technical details, or context
                  </p>
                  
                  <textarea
                    value={formData.detailed_description}
                    onChange={(e) => handleInputChange('detailed_description', e.target.value)}
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-gray-900"
                    placeholder="Any additional context, technical specifications, or detailed explanations..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div></div>
                    <p className={`text-sm font-medium ${
                      formData.detailed_description.length > 900 
                        ? 'text-orange-600' 
                        : 'text-gray-500'
                    }`}>
                      {formData.detailed_description.length}/1000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
              
              {/* Selected Categories Display */}
              {formData.categories.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-3">
                    {formData.categories.map(category => (
                      <span
                        key={category}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-200"
                      >
                        {category}
                        <X 
                          size={16} 
                          className="cursor-pointer hover:text-blue-600" 
                          onClick={() => removeCategory(category)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={formData.categories.length >= 5}
                  className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed bg-white text-lg"
                >
                  <span>
                    {formData.categories.length >= 5 
                      ? 'Maximum 5 categories selected' 
                      : 'Select a category to add...'}
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && formData.categories.length < 5 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {availableCategories
                      .filter(category => !formData.categories.includes(category))
                      .map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            addCategory(category)
                            setDropdownOpen(false)
                          }}
                          className="w-full px-6 py-3 text-left hover:bg-blue-50 hover:text-blue-800 font-medium text-gray-900 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {category}
                        </button>
                      ))}
                  </div>
                )}
                
                {dropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 font-medium">
                {formData.categories.length}/5 categories selected {formData.categories.length === 0 && <span className="text-red-500">*</span>}
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Visibility</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Private Option */}
                <div 
                  className={`rounded-lg p-6 border-2 cursor-pointer transition-all ${
                    formData.is_private 
                      ? 'bg-green-50 border-green-500 ring-2 ring-green-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePrivacyChange(true)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="text-green-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Private Storage</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      FREE
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="font-medium">• Dashboard access only</li>
                    <li className="font-medium">• No timestamping</li>
                    <li className="font-medium">• Can upgrade to public anytime</li>
                    <li className="font-medium">• Perfect for idea development</li>
                  </ul>
                </div>

                {/* Public Option */}
                <div 
                  className={`rounded-lg p-6 border-2 cursor-pointer transition-all ${
                    !formData.is_private 
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePrivacyChange(false)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="text-blue-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Public Protection</h3>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                      $1/month
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="font-medium">• Marketplace visibility</li>
                    <li className="font-medium">• Cryptographic timestamping</li>
                    <li className="font-medium">• Legal IP protection</li>
                    <li className="font-medium">• Cannot revert to private</li>
                  </ul>
                </div>
              </div>

              {/* Privacy Warning for Public */}
              {!formData.is_private && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <span className="font-bold text-yellow-900">Important Notice</span>
                  </div>
                  <p className="text-yellow-800 text-sm font-medium">
                    Once published as public, this idea cannot be changed back to private. You'll be charged $1/month until you cancel the subscription.
                  </p>
                </div>
              )}
            </div>

            {/* What Happens Next */}
            <div className={`rounded-2xl p-8 border-2 ${
              formData.is_private ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                formData.is_private ? 'text-green-900' : 'text-blue-900'
              }`}>
                What happens next?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {formData.is_private ? (
                    <ul className="space-y-3 text-green-800">
                      <li className="flex items-center gap-3 font-medium">
                        <Shield size={16} />
                        Stored privately in your personal vault
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Lock size={16} />
                        Only accessible through your dashboard
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <DollarSign size={16} />
                        No charges or fees - completely free
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-center gap-3 font-medium">
                        <Shield size={16} />
                        Payment processing via Stripe
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <Globe size={16} />
                        Cryptographic timestamping activated
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <DollarSign size={16} />
                        $1.00/month subscription begins
                      </li>
                    </ul>
                  )}
                </div>
                <div>
                  {formData.is_private ? (
                    <ul className="space-y-3 text-green-800">
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Can make public later for protection
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Edit or delete anytime
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Perfect for brainstorming
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Legal proof of creation date
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Professional IP documentation
                      </li>
                      <li className="flex items-center gap-3 font-medium">
                        <ArrowRight size={16} />
                        Can add updates over time
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !validateForm()}
                className={`px-12 py-4 rounded-xl font-bold text-white text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl ${
                  formData.is_private 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    {formData.is_private ? 'Storing Your Idea...' : 'Setting Up Protection...'}
                  </div>
                ) : (
                  formData.is_private ? 'Store My Idea - FREE' : 'Protect My Idea - $1/month'
                )}
              </button>
              
              <p className="text-gray-600 mt-4 font-medium">
                {formData.is_private 
                  ? 'Your idea will be stored privately and securely'
                  : 'You\'ll be redirected to secure payment processing'
                }
              </p>
            </div>
          </form>

          {/* Privacy Warning Modal */}
          {showPrivacyWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <Globe className="text-white" size={32} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Make Idea Public?
                  </h2>
                  <p className="text-blue-100 text-center">
                    Enable professional IP protection with timestamping
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Features */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="text-blue-600" size={16} />
                      </div>
                      <span className="text-gray-700 font-medium">Cryptographic timestamping</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Globe className="text-purple-600" size={16} />
                      </div>
                      <span className="text-gray-700 font-medium">Marketplace visibility</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="text-green-600" size={16} />
                      </div>
                      <span className="text-gray-700 font-medium">Professional IP documentation</span>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-yellow-600" size={20} />
                      <span className="font-bold text-yellow-900">Important Notice</span>
                    </div>
                    <p className="text-yellow-800 text-sm font-medium">
                      Once made public, this idea cannot be changed back to private. You'll be charged $1/month until cancelled.
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">$1.00</div>
                    <div className="text-blue-800 font-medium">per month</div>
                    <div className="text-blue-600 text-sm">Cancel anytime</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={cancelPrivacyChange}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                      Keep Private
                    </button>
                    <button
                      onClick={confirmPrivacyChange}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold transition-all shadow-lg"
                    >
                      Make Public
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stripe Checkout Modal */}
          {showStripeCheckout && createdIdeaId && (
            <StripeCheckout
              ideaId={createdIdeaId}
              ideaTitle={formData.summary}
              onSuccess={handleStripeSuccess}
              onCancel={handleStripeCancel}
            />
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <StripeSuccessModal
              ideaTitle={formData.summary}
              onClose={handleSuccessClose}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}