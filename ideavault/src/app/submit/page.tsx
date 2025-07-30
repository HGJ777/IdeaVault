// src/app/submit/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Shield, 
  Clock, 
  Lightbulb,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Lock
} from 'lucide-react'

export default function SubmitIdeaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    isPrivate: true,
    price: '',
    allowLicensing: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Integrate with Supabase
    console.log('Submitting idea:', formData)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)
    }, 2000)
  }

  const isFormValid = formData.title.trim() && formData.description.trim() && formData.category

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Idea Secured!</h1>
            <p className="text-gray-600 mb-6">
              Your idea has been timestamped and securely stored in your vault. 
              You now have proof of creation for "{formData.title}".
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full block bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                View in Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({
                    title: '',
                    description: '',
                    category: '',
                    tags: '',
                    isPrivate: true,
                    price: '',
                    allowLicensing: false
                  })
                }}
                className="w-full block border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Submit Another Idea
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                IdeaVault
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Idea</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protect your intellectual property with cryptographic timestamping. 
            Your idea will be securely stored and legally documented.
          </p>
        </div>

        {/* Security Features Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Shield size={24} />
              <div>
                <h3 className="font-semibold">Encrypted Storage</h3>
                <p className="text-sm text-purple-100">Bank-grade security</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} />
              <div>
                <h3 className="font-semibold">Timestamped Proof</h3>
                <p className="text-sm text-purple-100">Immutable creation date</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lightbulb size={24} />
              <div>
                <h3 className="font-semibold">IP Protection</h3>
                <p className="text-sm text-purple-100">Legal documentation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter a clear, descriptive title for your idea"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Make it specific and memorable (e.g., "AI-Powered Recipe Generator for Dietary Restrictions")
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                  placeholder="Describe your idea in detail. Include the problem it solves, how it works, target audience, and unique features. The more detail, the better your protection."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 50 characters. Include technical details, use cases, and implementation ideas.
                </p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology & Software</option>
                  <option value="healthcare">Healthcare & Medical</option>
                  <option value="education">Education & Learning</option>
                  <option value="finance">Finance & Fintech</option>
                  <option value="ecommerce">E-commerce & Retail</option>
                  <option value="entertainment">Entertainment & Media</option>
                  <option value="sustainability">Sustainability & Green Tech</option>
                  <option value="transportation">Transportation & Mobility</option>
                  <option value="food">Food & Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="ai, mobile-app, productivity, automation"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas. These help categorize and search your ideas.
                </p>
              </div>

              {/* Privacy & Monetization Settings */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy & Monetization</h3>
                
                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex items-center gap-3">
                    {formData.isPrivate ? <EyeOff size={20} className="text-gray-600" /> : <Eye size={20} className="text-green-600" />}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {formData.isPrivate ? 'Private Idea' : 'Public Idea'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.isPrivate 
                          ? 'Only you can see this idea' 
                          : 'Visible in public gallery and marketplace'
                        }
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* Pricing (only show if public) */}
                {!formData.isPrivate && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                        Licensing Price (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          placeholder="299"
                          min="1"
                          max="10000"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Set a price for others to license your idea. Leave blank if not for sale.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allowLicensing"
                        name="allowLicensing"
                        checked={formData.allowLicensing}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="allowLicensing" className="text-sm text-gray-700">
                        Allow others to license this idea for commercial use
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-8">
                <button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Securing Your Idea...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Secure My Idea
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  By submitting, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* What Happens Next */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Cryptographic Timestamping</h4>
                    <p className="text-sm text-gray-600">Your idea gets a secure, immutable timestamp proving when you created it.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Secure Storage</h4>
                    <p className="text-sm text-gray-600">Encrypted and stored with enterprise-grade security in your personal vault.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ready to Monetize</h4>
                    <p className="text-sm text-gray-600">If public, your idea becomes available for licensing in our marketplace.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips for Better Protection */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-blue-900">Tips for Better Protection</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Be as detailed as possible in your description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Include technical specifications and implementation details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Mention the problem your idea solves and target market</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use precise, industry-specific terminology</span>
                </li>
              </ul>
            </div>

            {/* Pricing Guide */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-green-900">Pricing Guide</h3>
              </div>
              <div className="space-y-3 text-sm text-green-800">
                <div>
                  <h4 className="font-medium">Simple Concepts</h4>
                  <p className="text-green-700">$25 - $100</p>
                </div>
                <div>
                  <h4 className="font-medium">App/Software Ideas</h4>
                  <p className="text-green-700">$100 - $500</p>
                </div>
                <div>
                  <h4 className="font-medium">Complex Systems</h4>
                  <p className="text-green-700">$500 - $2,000+</p>
                </div>
                <div>
                  <h4 className="font-medium">Hardware/Physical Products</h4>
                  <p className="text-green-700">$1,000 - $5,000+</p>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Protection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                IdeaVault provides cryptographic proof of creation and secure storage. 
                While this establishes a clear timestamp and protects your intellectual property, 
                it does not replace formal patents for inventions requiring patent protection. 
                Consult with an IP attorney for comprehensive legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}