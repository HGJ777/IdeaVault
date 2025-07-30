// src/app/support/page.tsx
import Link from 'next/link'
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  FileText, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Book,
  Video,
  Headphones
} from 'lucide-react'

export default function SupportPage() {
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
            How Can We <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Help</span> You?
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
            Get the support you need to protect and monetize your ideas. Our team is here to help you succeed.
          </p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search help articles, FAQs, and tutorials..."
                className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get Support Your Way</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the support method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Live Chat */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-3xl transform hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Chat</h3>
              <p className="text-purple-100 mb-6 leading-relaxed">
                Get instant help from our support team. Available 24/7 for Premium users, 
                business hours for Free users.
              </p>
              <div className="flex items-center gap-2 text-green-300 mb-6">
                <CheckCircle size={20} />
                <span className="font-medium">Typically responds in under 2 minutes</span>
              </div>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                Start Chat
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Email Support */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Send us detailed questions and we'll get back to you with comprehensive answers. 
                Perfect for complex technical issues.
              </p>
              <div className="flex items-center gap-2 text-green-600 mb-6">
                <Clock size={20} />
                <span className="font-medium">Response within 4 hours</span>
              </div>
              <Link 
                href="mailto:support@ideavault.com"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Send Email
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Phone Support */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Phone Support</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Speak directly with our experts for immediate assistance. Available for 
                Enterprise customers and urgent Premium issues.
              </p>
              <div className="flex items-center gap-2 text-orange-600 mb-6">
                <Users size={20} />
                <span className="font-medium">Enterprise & Premium only</span>
              </div>
              <Link 
                href="tel:+1-555-IDEA-HELP"
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Call Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Popular Help Topics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to the most common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Getting Started */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Book className="text-purple-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Learn the basics of protecting and submitting your first idea on IdeaVault.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Creating your account</li>
                <li>• Submitting your first idea</li>
                <li>• Understanding timestamps</li>
                <li>• Setting up your profile</li>
              </ul>
            </div>

            {/* Security & Legal */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Legal</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Understand how we protect your intellectual property and legal documentation.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Cryptographic timestamping</li>
                <li>• Legal documentation</li>
                <li>• Privacy protection</li>
                <li>• IP ownership rights</li>
              </ul>
            </div>

            {/* Selling & Licensing */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Selling & Licensing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Learn how to monetize your ideas and set up licensing agreements.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Setting up marketplace listings</li>
                <li>• Pricing strategies</li>
                <li>• Licensing agreements</li>
                <li>• Payment processing</li>
              </ul>
            </div>

            {/* Account Management */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Management</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage your subscription, billing, and account settings.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Subscription management</li>
                <li>• Billing and payments</li>
                <li>• Profile settings</li>
                <li>• Data export</li>
              </ul>
            </div>

            {/* Troubleshooting */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Headphones className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Resolve common technical issues and platform problems.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Login problems</li>
                <li>• Upload issues</li>
                <li>• Payment failures</li>
                <li>• Browser compatibility</li>
              </ul>
            </div>

            {/* API & Integrations */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Video className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">API & Integrations</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Developer resources for integrating with IdeaVault's API.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• API documentation</li>
                <li>• Integration guides</li>
                <li>• Webhooks setup</li>
                <li>• SDK downloads</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to the most common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How secure is my intellectual property?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your ideas are protected with military-grade 256-bit encryption and stored on secure servers. 
                  We use blockchain timestamping to create immutable proof of creation that's legally admissible.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I keep my ideas completely private?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely. With a Premium subscription, you can store unlimited ideas privately in your vault. 
                  Private ideas still receive full cryptographic protection and legal documentation.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How do I price my ideas for sale?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered pricing tool analyzes market data, complexity, and commercial potential to suggest 
                  optimal pricing. You can also browse similar ideas in our marketplace to understand current rates.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What happens if someone steals my idea?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our cryptographic timestamping provides legally admissible proof of when you created your idea. 
                  This establishes prior art and can be used in legal proceedings to protect your intellectual property.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How quickly do I get support responses?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Live chat: Under 2 minutes. Email: Within 4 hours. Phone support is available for Enterprise 
                  customers and urgent Premium issues. Free users get community support and email during business hours.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Can I collaborate with others on ideas?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! Premium users get access to collaboration tools that allow you to work with co-creators, 
                  manage permissions, and automatically split revenues when ideas are licensed or sold.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">What types of ideas can I protect?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Any creative concept: app ideas, business models, inventions, artistic concepts, processes, 
                  formulations, designs, and more. If you can describe it, we can protect it with timestamping.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, we offer a 30-day money-back guarantee for all subscriptions. If you're not completely 
                  satisfied with IdeaVault, we'll refund your payment in full, no questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Still Need Help?
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Can't find what you're looking for? Our support team is here to help. 
                Send us a message and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Clock className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Response Time</h3>
                    <p className="text-gray-600">Within 4 hours for all inquiries</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Expert Team</h3>
                    <p className="text-gray-600">Technical and legal experts ready to help</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Secure Communication</h3>
                    <p className="text-gray-600">All messages are encrypted and confidential</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-10 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="legal">Legal Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    placeholder="Please describe your question or issue in detail..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  Send Message
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse more ways to get help and learn about IdeaVault
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Book className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Knowledge Base</h3>
              <p className="text-gray-600 mb-4">Comprehensive guides and tutorials</p>
              <Link href="/docs" className="text-purple-600 font-medium hover:text-purple-700 flex items-center justify-center gap-1">
                Browse Articles <ArrowRight size={16} />
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">Step-by-step video guides</p>
              <Link href="/videos" className="text-blue-600 font-medium hover:text-blue-700 flex items-center justify-center gap-1">
                Watch Videos <ArrowRight size={16} />
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Forum</h3>
              <p className="text-gray-600 mb-4">Connect with other creators</p>
              <Link href="/community" className="text-green-600 font-medium hover:text-green-700 flex items-center justify-center gap-1">
                Join Forum <ArrowRight size={16} />
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">API Docs</h3>
              <p className="text-gray-600 mb-4">Developer documentation</p>
              <Link href="/api" className="text-yellow-600 font-medium hover:text-yellow-700 flex items-center justify-center gap-1">
                View Docs <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Join thousands of creators who trust IdeaVault to protect their intellectual property. 
            Our support team is here to help you every step of the way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/gallery"
              className="px-12 py-5 border-2 border-white text-white text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Ideas
            </Link>
          </div>
          
          <p className="text-purple-200 mt-10 text-lg">
            Need help? Our support team responds within 4 hours
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