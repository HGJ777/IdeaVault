// src/app/page.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, Shield, DollarSign, Scale, Check } from 'lucide-react'
import { Navigation } from './components/Navigation'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Save your genius.{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Before someone else does.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Store your ideas securely, timestamped, and ready to sell — for just $1/month.
          </p>
          
          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href="/signup"
              className="px-12 py-5 bg-purple-600 text-white text-xl font-bold rounded-2xl hover:bg-purple-700 transition-colors shadow-lg flex items-center gap-3"
            >
              Start Free Today
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/gallery"
              className="px-12 py-5 border-2 border-purple-600 text-purple-600 text-xl font-bold rounded-2xl hover:bg-purple-50 transition-colors"
            >
              Browse Ideas
            </Link>
          </div>
          
          <p className="text-gray-500 text-lg">
            No credit card required • Start with 1 free idea • Upgrade anytime
          </p>
        </div>
      </section>

      {/* Why Use IdeaVault Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Why Use IdeaVault?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🔐 Secure & Timestamped
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every idea gets a cryptographic timestamp and secure storage. 
                Prove when you thought of it with immutable records.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💰 Sell or License It
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Turn your ideas into income. Set your price and let others 
                license your concepts for their startups and projects.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Scale className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ⚖️ No $300 Patent Needed
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Skip expensive patents for simple concepts. Get legal timestamping 
                and proof of creation at a fraction of the cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Multiple Ways to Grow Your Ideas
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <DollarSign className="text-green-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                💰 Sell Your Ideas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                License your concepts to entrepreneurs and businesses. Set your own price 
                and earn from your creativity. From simple app ideas to complex systems.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Scale className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🤝 Trade & Collaborate
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Exchange ideas with other creators. Trade concepts, collaborate on projects, 
                and build partnerships. Turn individual ideas into joint ventures.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="text-purple-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                📈 Attract Investment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Showcase your ideas to investors and angel funders. Get backing for 
                implementation with timestamped proof of originality and detailed documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join the Innovation Economy
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Thousands of creators are already protecting and monetizing their ideas
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">12,000+</div>
              <div className="text-gray-600 font-medium">Ideas Protected</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-green-600 mb-2">$2.4M+</div>
              <div className="text-gray-600 font-medium">Creator Earnings</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">Active Creators</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Protect & Profit
          </h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex gap-6 p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={32} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cryptographic Timestamping</h3>
                  <p className="text-gray-600">Immutable proof of when you created your idea with blockchain-grade security</p>
                </div>
              </div>
              
              <div className="flex gap-6 p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Marketplace</h3>
                  <p className="text-gray-600">List your ideas for sale immediately with built-in payment processing</p>
                </div>
              </div>
              
              <div className="flex gap-6 p-6 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Scale size={32} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Legal Documentation</h3>
                  <p className="text-gray-600">Automatically generated legal docs for licensing and intellectual property</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-6">Ready to Start?</h3>
              <p className="text-purple-100 mb-8 text-lg">
                Join thousands of innovators who trust IdeaVault to protect and monetize their creativity.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={24} />
                  <span className="text-lg">Free account with 1 public idea</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={24} />
                  <span className="text-lg">Instant timestamped protection</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-400" size={24} />
                  <span className="text-lg">Access to global marketplace</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="inline-block bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Start Free Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Your Ideas Are Worth Protecting
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Don't let your next breakthrough slip away. Join the community of innovators 
            who trust IdeaVault to secure, protect, and monetize their creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/gallery"
              className="px-12 py-5 border-2 border-white text-white text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-colors"
            >
              Start Browsing
            </Link>
          </div>
          
          <p className="text-purple-200 mt-10 text-lg">
            No credit card required • Start with 1 free idea • Upgrade anytime for $1/month
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