// src/app/how-it-works/page.tsx
import Link from 'next/link'
import { ArrowRight, Shield, Clock, DollarSign, FileText, Users, Zap, CheckCircle, Lock, Globe } from 'lucide-react'

export default function HowItWorksPage() {
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
            How <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">IdeaVault</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            From idea to income in <span className="font-semibold text-purple-600">3 simple steps</span>. 
            Protect, showcase, and monetize your creativity with military-grade security.
          </p>
        </div>
      </section>

      {/* Main Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The IdeaVault Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and designed for creators
            </p>
          </div>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Submit Your Idea</h3>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Write down your concept, invention, or startup idea. Add as much detail as you want—our platform 
                  securely stores everything from simple sketches to complex technical specifications.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">Detailed description with images and files</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">Category and tag classification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">Privacy settings (public or private)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-gray-700">Licensing terms and pricing</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-purple-600" size={24} />
                    <h4 className="text-xl font-bold text-gray-900">Idea Submission Form</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-100 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-purple-200 rounded px-3 text-xs flex items-center">AI</div>
                      <div className="h-8 bg-blue-200 rounded px-3 text-xs flex items-center">Mobile</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Lock It In</h3>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  We timestamp and encrypt your idea with blockchain-grade security. You now have immutable proof 
                  of when you created it—stronger than traditional patents for many use cases.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="text-blue-500" size={20} />
                    <span className="text-gray-700">Cryptographic timestamping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lock className="text-blue-500" size={20} />
                    <span className="text-gray-700">256-bit encryption</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-500" size={20} />
                    <span className="text-gray-700">Immutable proof of creation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={20} />
                    <span className="text-gray-700">Legal documentation generated</span>
                  </div>
                </div>
              </div>
              <div className="lg:order-1 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-blue-600" size={24} />
                    <h4 className="text-xl font-bold text-gray-900">Security Process</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={16} />
                      </div>
                      <span className="text-sm text-gray-700">Encrypted & Stored</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={16} />
                      </div>
                      <span className="text-sm text-gray-700">Blockchain Timestamped</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={16} />
                      </div>
                      <span className="text-sm text-gray-700">Legal Docs Generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900">Monetize & Share</h3>
                </div>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Keep it private in your vault or make it public to sell. Set licensing terms, collaborate with others, 
                  or attract investors. You control how your idea gets used and who benefits from it.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-green-500" size={20} />
                    <span className="text-gray-700">Set your own licensing price</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="text-green-500" size={20} />
                    <span className="text-gray-700">Connect with potential partners</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="text-green-500" size={20} />
                    <span className="text-gray-700">Global marketplace exposure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="text-green-500" size={20} />
                    <span className="text-gray-700">Instant payment processing</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="text-green-600" size={24} />
                    <h4 className="text-xl font-bold text-gray-900">Marketplace Listing</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">License Price</span>
                      <span className="font-bold text-green-600">$299</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interested Buyers</span>
                      <span className="font-bold">23</span>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-700 font-medium">Recent Activity</div>
                      <div className="text-xs text-green-600">3 new inquiries today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to protect and profit from your ideas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cryptographic Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Military-grade encryption ensures your ideas remain secure. Blockchain timestamping provides 
                immutable proof of creation that holds up in legal proceedings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Marketplace</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with entrepreneurs, businesses, and investors worldwide. Our AI-powered matching 
                system helps the right people discover your ideas.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Payments</h3>
              <p className="text-gray-600 leading-relaxed">
                Secure payment processing with instant transfers. Set your price, receive payments immediately, 
                and track your earnings with detailed analytics.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Legal Documentation</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically generated licensing agreements, NDAs, and legal documents. Work with our 
                partner law firms for complex IP protection needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Work with co-creators, manage permissions, and split revenues automatically. 
                Built-in communication tools facilitate seamless collaboration.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Get market analysis, pricing recommendations, and competitive insights powered by AI. 
                Understand your idea's commercial potential before listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bank-Grade Security
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Your intellectual property is protected by the same security standards used by 
                financial institutions and government agencies.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">256-Bit Encryption</h3>
                    <p className="text-gray-600">End-to-end encryption ensures only you can access your ideas</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Timestamping</h3>
                    <p className="text-gray-600">Immutable proof of creation stored on distributed ledger</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Zero-Knowledge Architecture</h3>
                    <p className="text-gray-600">We can't see your ideas—only you have the encryption keys</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-6">Security Certifications</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>ISO 27001 Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>GDPR & CCPA Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>Regular Security Audits</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={20} />
                  <span>24/7 Security Monitoring</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/10 rounded-xl">
                <p className="text-purple-100 text-sm">
                  "IdeaVault's security infrastructure exceeds industry standards. 
                  Your intellectual property is safer here than in traditional filing systems."
                </p>
                <p className="text-white font-semibold mt-2">— CyberSec Labs Audit Report</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about protecting and monetizing your ideas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How strong is the legal protection?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our cryptographic timestamping provides legally admissible proof of creation. While not a replacement 
                  for patents, it establishes prior art and creation dates that hold up in court for most disputes.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What types of ideas can I protect?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Any creative concept: app ideas, business models, inventions, artistic concepts, processes, 
                  formulations, designs, and more. If you can describe it, we can protect it.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How do I price my ideas?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI analyzes market data, complexity, and potential value to suggest pricing. You can also 
                  browse similar ideas in our marketplace to understand current market rates.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I keep my ideas completely private?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. You can store ideas privately in your vault without ever making them public. 
                  Private storage still includes full cryptographic protection and legal documentation.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What happens when someone licenses my idea?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Payment is processed instantly, legal documents are automatically generated, and you receive 
                  the licensing fee minus our small transaction fee. The buyer gets proper licensing rights.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do you take ownership of my ideas?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Never. You retain 100% ownership of your intellectual property. We're simply the platform 
                  that helps you protect, showcase, and monetize your creations.
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
            Ready to Protect Your Next Big Idea?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of innovators who trust IdeaVault to secure their intellectual property 
            and connect with the right opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-3"
            >
              Start Protecting Ideas
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