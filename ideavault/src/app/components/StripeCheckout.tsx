// src/components/StripeCheckout.tsx
'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { CheckCircle, CreditCard, Loader } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  ideaId: string
  ideaTitle: string
  onSuccess: () => void
  onCancel: () => void
}

function CheckoutForm({ ideaId, ideaTitle, onSuccess, onCancel }: StripeCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      // Create subscription
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, ideaTitle })
      })

      const { subscriptionId, clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      onSuccess()

    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-blue-800">IP Protection for:</span>
            <span className="font-medium text-blue-900">"{ideaTitle}"</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-800">Monthly subscription:</span>
            <span className="font-bold text-blue-900">$1.00/month</span>
          </div>
          <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
            <span className="font-bold text-blue-900">Total due today:</span>
            <span className="font-bold text-blue-900 text-lg">$1.00</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <label className="block text-lg font-bold text-gray-900">
          Payment Method
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={16} />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={16} />
              Start Protection - $1/month
            </>
          )}
        </button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-600 text-center">
        By clicking "Start Protection", you agree to our Terms of Service and authorize monthly charges of $1.00 until cancelled.
      </p>
    </form>
  )
}

export function StripeCheckout({ ideaId, ideaTitle, onSuccess, onCancel }: StripeCheckoutProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <CreditCard className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Secure Your IP Protection
          </h2>
          <p className="text-blue-100 text-center">
            Cryptographic timestamping & legal protection
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm
              ideaId={ideaId}
              ideaTitle={ideaTitle}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

// ---

// src/components/StripeSuccessModal.tsx
export function StripeSuccessModal({ ideaTitle, onClose }: { ideaTitle: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <CheckCircle className="text-white" size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            🎉 Payment Successful!
          </h2>
          <p className="text-green-100 text-center">
            Your idea is now protected
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-bold text-gray-900">
              "{ideaTitle}" is now publicly protected!
            </h3>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="space-y-2 text-sm text-green-800">
                <p className="font-medium">✅ Cryptographically timestamped</p>
                <p className="font-medium">✅ Visible in public marketplace</p>
                <p className="font-medium">✅ Legal IP protection active</p>
                <p className="font-medium">✅ $1/month subscription started</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button
                onClick={onClose}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold"
              >
                View My Protected Ideas
              </button>
              
              <p className="text-xs text-gray-600">
                You can manage your subscription anytime in the billing section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}