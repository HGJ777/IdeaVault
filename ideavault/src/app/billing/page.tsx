// src/app/billing/page.tsx - FIXED WITH STRIPE PAYMENT METHODS
'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '../components/Navigation'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  Download, 
  Check, 
  Crown, 
  Star,
  Calendar,
  DollarSign,
  Globe,
  Lock,
  AlertTriangle,
  Eye,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Plus,
  X,
  Save
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface PublicIdea {
  id: string
  title: string
  created_at: string
  billing_status: string
  subscription_id: string | null
  views: number
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
}

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  is_default: boolean
}

// Card Setup Component
function CardSetupForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (paymentMethodError) throw paymentMethodError

      // Save payment method to customer
      const response = await fetch('/api/stripe/save-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id })
      })

      if (!response.ok) throw new Error('Failed to save payment method')

      onSuccess()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Card
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function BillingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [publicIdeas, setPublicIdeas] = useState<PublicIdea[]>([])
  const [totalMonthlyCost, setTotalMonthlyCost] = useState(0)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showAddCard, setShowAddCard] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      fetchBillingData()
      fetchPaymentMethods()
    }
  }, [user])

  const fetchBillingData = async () => {
    try {
      setLoading(true)
      
      // Fetch public ideas with billing info
      const { data: ideas, error: ideasError } = await supabase
        .from('ideas')
        .select('id, title, created_at, billing_status, subscription_id, views')
        .eq('user_id', user?.id)
        .eq('is_private', false)
        .order('created_at', { ascending: false })

      if (ideasError) throw ideasError
      
      setPublicIdeas(ideas || [])
      setTotalMonthlyCost((ideas || []).length * 1) // $1 per public idea

      // TODO: Fetch actual invoices from Stripe webhook data
      // For now, mock some invoices
      const mockInvoices: Invoice[] = ideas?.map((idea, index) => ({
        id: `inv_${idea.id}_${index}`,
        date: new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        amount: 1.00,
        status: 'paid' as const,
        description: `IP Protection for "${idea.title}"`
      })) || []
      
      setInvoices(mockInvoices)

    } catch (error: any) {
      setError(error.message)
      console.error('Error fetching billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/stripe/payment-methods')
      if (!response.ok) throw new Error('Failed to fetch payment methods')
      
      const data = await response.json()
      setPaymentMethods(data.paymentMethods || [])
    } catch (error: any) {
      console.error('Error fetching payment methods:', error)
      // Don't show error to user as this might fail if no customer exists yet
    }
  }

  const handleCancelSubscription = async (ideaId: string, subscriptionId: string) => {
    if (!confirm('Cancel IP protection for this idea? This will make it private and stop monthly billing.')) {
      return
    }

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, ideaId })
      })

      if (!response.ok) throw new Error('Failed to cancel subscription')

      // Update local state
      setPublicIdeas(prev => prev.filter(idea => idea.id !== ideaId))
      setTotalMonthlyCost(prev => prev - 1)

      setSuccess('Subscription cancelled successfully!')
    } catch (error: any) {
      setError('Error cancelling subscription: ' + error.message)
    }
  }

  const deletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Remove this payment method?')) return

    try {
      const response = await fetch('/api/stripe/delete-payment-method', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId })
      })

      if (!response.ok) throw new Error('Failed to delete payment method')

      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId))
      setSuccess('Payment method removed successfully!')
    } catch (error: any) {
      setError('Error removing payment method: ' + error.message)
    }
  }

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const response = await fetch('/api/stripe/set-default-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId })
      })

      if (!response.ok) throw new Error('Failed to set default payment method')

      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        is_default: pm.id === paymentMethodId
      })))
      setSuccess('Default payment method updated!')
    } catch (error: any) {
      setError('Error updating default payment method: ' + error.message)
    }
  }

  const downloadInvoice = async (invoiceId: string) => {
    try {
      // TODO: Call your API route to get Stripe invoice PDF
      const response = await fetch(`/api/stripe/invoice/${invoiceId}`)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoiceId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      setError('Error downloading invoice: ' + error.message)
    }
  }

  const handleCardAdded = () => {
    setShowAddCard(false)
    setSuccess('Payment method added successfully!')
    fetchPaymentMethods()
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
              <span className="text-blue-600">Billing</span> & Subscriptions
            </h1>
            <p className="text-xl text-gray-600">
              Manage your IP protection subscriptions and payment history
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="max-w-6xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">{success}</span>
              <button
                onClick={() => setSuccess('')}
                className="ml-auto text-green-600 hover:text-green-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertTriangle className="text-red-600" size={20} />
              <span className="text-red-800 font-medium">{error}</span>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="w-full px-2 max-w-6xl mx-auto space-y-6">
            {/* Billing Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Subscriptions</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <Globe className="text-blue-600 mx-auto mb-4" size={32} />
                  <p className="text-3xl font-bold text-blue-600 mb-2">{publicIdeas.length}</p>
                  <p className="text-lg font-bold text-gray-700">Protected Ideas</p>
                  <p className="text-sm text-gray-500 mt-1">With IP timestamping</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                  <DollarSign className="text-green-600 mx-auto mb-4" size={32} />
                  <p className="text-3xl font-bold text-green-600 mb-2">${totalMonthlyCost}</p>
                  <p className="text-lg font-bold text-gray-700">Monthly Total</p>
                  <p className="text-sm text-gray-500 mt-1">$1 per protected idea</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <Eye className="text-purple-600 mx-auto mb-4" size={32} />
                  <p className="text-3xl font-bold text-purple-600 mb-2">
                    {publicIdeas.reduce((sum, idea) => sum + (idea.views || 0), 0)}
                  </p>
                  <p className="text-lg font-bold text-gray-700">Total Views</p>
                  <p className="text-sm text-gray-500 mt-1">Across protected ideas</p>
                </div>
              </div>

              {/* How Billing Works */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-blue-600" size={20} />
                  <h4 className="font-bold text-blue-900">How Our Billing Works</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-medium mb-2">💚 Private Ideas: FREE</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Stored in your private dashboard</li>
                      <li>• No monthly charges</li>
                      <li>• Can upgrade to public anytime</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">💙 Public Ideas: $1/month each</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Cryptographic timestamping</li>
                      <li>• Marketplace visibility</li>
                      <li>• Legal IP protection</li>
                      <li>• Cancel anytime (becomes private)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Protected Ideas List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Protected Ideas</h3>
                <span className="text-sm text-gray-600">
                  {publicIdeas.length} ideas • ${totalMonthlyCost}/month
                </span>
              </div>

              {publicIdeas.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Lock className="mx-auto mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Protected Ideas Yet</h4>
                  <p className="mb-6">Make an idea public to start IP protection with timestamping</p>
                  <a 
                    href="/create"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Globe size={16} />
                    Create Protected Idea
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {publicIdeas.map((idea) => (
                    <div key={idea.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{idea.title}</h4>
                          <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                            idea.billing_status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : idea.billing_status === 'past_due'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {idea.billing_status === 'active' ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {idea.billing_status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Protected since {new Date(idea.created_at).toLocaleDateString()}</span>
                          <span>{idea.views || 0} views</span>
                          <span className="font-medium text-green-600">$1.00/month</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <a
                          href={`/idea/${idea.id}`}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Idea"
                        >
                          <ExternalLink size={16} />
                        </a>
                        
                        {idea.subscription_id && (
                          <button
                            onClick={() => handleCancelSubscription(idea.id, idea.subscription_id!)}
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Cancel Protection"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button 
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Card
                </button>
              </div>

              {paymentMethods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="mx-auto mb-3" size={48} />
                  <p className="font-medium">No payment methods added yet</p>
                  <p className="text-sm">Add a payment method to protect your ideas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            •••• •••• •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            {method.brand.toUpperCase()} • Expires {method.exp_month}/{method.exp_year}
                          </p>
                        </div>
                        {method.is_default && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!method.is_default && (
                          <button
                            onClick={() => setDefaultPaymentMethod(method.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => deletePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                          title="Remove Card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto mb-3" size={48} />
                  <p>No billing history yet</p>
                  <p className="text-sm">Your invoices will appear here once you protect ideas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-700">{invoice.description}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">
                            ${invoice.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status === 'paid' ? (
                                <CheckCircle size={12} />
                              ) : (
                                <XCircle size={12} />
                              )}
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => downloadInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Billing Support */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">Need Help?</h4>
              <p className="text-gray-700 mb-4">
                Have questions about your billing or need to update your payment method?
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:billing@ideavault.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </a>
                <a
                  href="/help/billing"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Billing FAQ
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Add Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
                  <button
                    onClick={() => setShowAddCard(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <Elements stripe={stripePromise}>
                  <CardSetupForm 
                    onSuccess={handleCardAdded}
                    onCancel={() => setShowAddCard(false)}
                  />
                </Elements>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}