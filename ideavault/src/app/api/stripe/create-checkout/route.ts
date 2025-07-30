// src/app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export async function POST(request: NextRequest) {
  try {
    const { ideaId, ideaTitle } = await request.json()
    
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = ''
    
    const { data: existingCustomer } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      stripeCustomerId = existingCustomer.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      })
      stripeCustomerId = customer.id

      // Save customer to database
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: stripeCustomerId,
          total_monthly_cost: 0,
          billing_status: 'active'
        })
    }

    // Create subscription for this specific idea
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{
        price: process.env.STRIPE_PRICE_ID!,
      }],
      metadata: {
        idea_id: ideaId,
        user_id: user.id
      },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    }) as any

    const invoice = subscription.latest_invoice as any
    const paymentIntent = invoice.payment_intent as any

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    })

  } catch (error: any) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}