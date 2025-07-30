// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any
        
        const ideaId = subscription.metadata.idea_id
        const userId = subscription.metadata.user_id

        // Update idea billing status
        await supabase
          .from('ideas')
          .update({
            billing_status: 'active',
            subscription_id: subscription.id,
            stripe_price_id: process.env.STRIPE_PRICE_ID
          })
          .eq('id', ideaId)
          .eq('user_id', userId)

        console.log(`Payment succeeded for idea ${ideaId}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any
        
        const ideaId = subscription.metadata.idea_id
        const userId = subscription.metadata.user_id

        // Update idea billing status
        await supabase
          .from('ideas')
          .update({
            billing_status: 'past_due'
          })
          .eq('id', ideaId)
          .eq('user_id', userId)

        console.log(`Payment failed for idea ${ideaId}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        
        const ideaId = subscription.metadata.idea_id
        const userId = subscription.metadata.user_id

        // Make idea private and update billing status
        await supabase
          .from('ideas')
          .update({
            is_private: true,
            billing_status: 'canceled',
            subscription_id: null
          })
          .eq('id', ideaId)
          .eq('user_id', userId)

        console.log(`Subscription cancelled for idea ${ideaId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}