// src/app/pricing/page.tsx
import Link from 'next/link'
import { Check, X, Star, Shield, Users, Zap, Crown, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="px-4 py-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105">
            IdeaVault
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
            <Link href="/gallery" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 font-medium transform hover:scale-105 font-semibold">
                Browse Ideas
            </Link>
            <Link href="/AboutUs" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                About Us
            </Link>
            <Link href="/HIW" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                How It Works
            </Link>
            <Link href="/pricing" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                Pricing
            </Link>
            <Link href="/support" className="px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                Support
            </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="px-6 py-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Simple, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Honest</span> Pricing
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Start free and upgrade when you're ready. No hidden fees, no complex contracts. 
            Just <span className="font-semibold text-purple-600">$1/month</span> for unlimited idea protection.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 relative hover:shadow-lg transition-shadow">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  $0<span className="text-lg text-gray-500 font-normal">/month</span>
                </div>
                <p className="text-gray-600">Perfect for trying out IdeaVault</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>1 public idea submission</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Cryptographic timestamping</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Basic legal documentation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Marketplace listing</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400 flex-shrink-0" size={20} />
                  <span className="text-gray-400">Private vault storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400 flex-shrink-0" size={20} />
                  <span className="text-gray-400">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="text-gray-400 flex-shrink-0" size={20} />
                  <span className="text-gray-400">Priority support</span>
                </li>
              </ul>
              
              <Link 
                href="/signup"
                className="w-full block text-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-3xl p-8 relative transform hover:scale-105 transition-transform shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star size={16} fill="currentColor" />
                  MOST POPULAR
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="text-5xl font-bold mb-2">
                  $1<span className="text-lg text-purple-200 font-normal">/month</span>
                </div>
                <p className="text-purple-100">For serious creators and inventors</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Unlimited idea submissions</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Private vault storage</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Advanced legal documentation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Sell & license your ideas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Advanced analytics & insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Collaboration tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={20} />
                  <span>Priority email support</span>
                </li>
              </ul>
              
              <Link 
                href="/signup"
                className="w-full block text-center px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
              >
                Start Premium Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 relative hover:shadow-lg transition-shadow">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Crown className="text-yellow-600" size={24} />
                  <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  Custom
                </div>
                <p className="text-gray-600">For teams and organizations</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Team collaboration features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Advanced security controls</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Custom legal templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>API access & integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 flex-shrink-0" size={20} />
                  <span>24/7 phone support</span>
                </li>
              </ul>
              
              <Link 
                href="/contact"
                className="w-full block text-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Compare All Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center p-6 font-semibold text-purple-600 bg-purple-50">Premium</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Idea Submissions</td>
                    <td className="p-6 text-center text-gray-600">1 public</td>
                    <td className="p-6 text-center bg-purple-50 text-purple-600 font-semibold">Unlimited</td>
                    <td className="p-6 text-center text-gray-600">Unlimited</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Private Storage</td>
                    <td className="p-6 text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="p-6 text-center bg-purple-50"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Cryptographic Timestamping</td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center bg-purple-50"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Legal Documentation</td>
                    <td className="p-6 text-center text-gray-600">Basic</td>
                    <td className="p-6 text-center bg-purple-50 text-purple-600 font-semibold">Advanced</td>
                    <td className="p-6 text-center text-gray-600">Custom</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Marketplace Listing</td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center bg-purple-50"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Analytics & Insights</td>
                    <td className="p-6 text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="p-6 text-center bg-purple-50"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center"><Check className="text-green-500 mx-auto" size={20} /></td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Collaboration Tools</td>
                    <td className="p-6 text-center"><X className="text-gray-400 mx-auto" size={20} /></td>
                    <td className="p-6 text-center bg-purple-50"><Check className="text-green-500 mx-auto" size={20} /></td>
                    <td className="p-6 text-center text-gray-600">Advanced</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-6 font-medium text-gray-900">Support</td>
                    <td className="p-6 text-center text-gray-600">Community</td>
                    <td className="p-6 text-center bg-purple-50 text-purple-600 font-semibold">Email</td>
                    <td className="p-6 text-center text-gray-600">24/7 Phone</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose IdeaVault?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare our value to traditional alternatives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-red-50 rounded-3xl border border-red-200">
              <div className="text-4xl font-bold text-red-600 mb-2">$15,000+</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Traditional Patent</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 18+ month process</li>
                <li>• High attorney fees</li>
                <li>• Complex paperwork</li>
                <li>• Limited protection scope</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-green-50 rounded-3xl border-2 border-green-400 transform scale-105">
              <div className="text-4xl font-bold text-green-600 mb-2">$12/year</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">IdeaVault Premium</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Instant protection</li>
                <li>• No attorney required</li>
                <li>• Simple process</li>
                <li>• Built-in monetization</li>
              </ul>
            </div>

            <div className="text-center p-8 bg-yellow-50 rounded-3xl border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600 mb-2">$0</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">No Protection</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Ideas can be stolen</li>
                <li>• No legal recourse</li>
                <li>• Lost opportunities</li>
                <li>• Wasted creativity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Calculate Your ROI
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                See how quickly IdeaVault pays for itself when you start monetizing your ideas.
              </p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-900">Annual IdeaVault Cost</span>
                  <span className="text-2xl font-bold text-purple-600">$12</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-medium text-gray-900">Average Idea Sale Price</span>
                  <span className="text-2xl font-bold text-green-600">$450</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-green-100 rounded-xl border-2 border-green-400">
                  <span className="font-bold text-gray-900">ROI with 1 Sale</span>
                  <span className="text-3xl font-bold text-green-600">3,650%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Success Stories</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-purple-900">Sarah M.</span>
                    <span className="text-purple-600 font-bold">$2,400 earned</span>
                  </div>
                  <p className="text-purple-700 text-sm">"Sold my productivity app concept to a startup. Paid for 200 years of IdeaVault!"</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-900">Marcus J.</span>
                    <span className="text-blue-600 font-bold">$890 earned</span>
                  </div>
                  <p className="text-blue-700 text-sm">"Licensed my IoT device idea to a hardware company. Amazing platform!"</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-900">Elena R.</span>
                    <span className="text-green-600 font-bold">$1,200 earned</span>
                  </div>
                  <p className="text-green-700 text-sm">"Found an investor for my sustainable fashion marketplace through IdeaVault!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Pricing FAQ</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. You can cancel your subscription at any time with no penalties. 
                  Your protected ideas remain secure even after cancellation.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600 leading-relaxed">
                  We accept all major credit cards, debit cards, and PayPal. All payments are 
                  processed securely through Stripe with industry-standard encryption.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied 
                  with IdeaVault, we'll refund your payment in full.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Are there any transaction fees?</h3>
                <p className="text-gray-600 leading-relaxed">
                  We take a small 5% fee when you successfully sell or license an idea. 
                  There are no other hidden fees or charges.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, 
                  and downgrades take effect at your next billing cycle.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Is there a free trial for Premium?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! New users get a 14-day free trial of Premium features. No credit card 
                  required to start your trial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Start Protecting Your Ideas?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of creators who trust IdeaVault to secure their intellectual property. 
            Start free and upgrade when you're ready to unlock the full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-3"
            >
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/gallery"
              className="px-12 py-5 border-2 border-white text-white text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
          
          <p className="text-purple-200 mt-10 text-lg">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 md:mb-0">
              IdeaVault
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-10 text-center text-gray-400">
            <p>&copy; 2025 IdeaVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}