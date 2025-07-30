// src/app/api/stripe/cancel-subscription/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})
// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // You'll need this for server-side
)

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, ideaId } = await request.json()
    
    // Get user from authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cancel the Stripe subscription
    await stripe.subscriptions.cancel(subscriptionId)

    // Update the idea to be private
    const { error: updateError } = await supabase
      .from('ideas')
      .update({
        is_private: true,
        billing_status: 'canceled',
        subscription_id: null
      })
      .eq('id', ideaId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update idea status')
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}