// src/app/about/page.tsx
import Link from 'next/link'
import { Shield, Users, Lightbulb, Target, Award, Globe, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
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
            About <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">IdeaVault</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're building the world's most trusted platform for <span className="font-semibold text-purple-600">protecting</span>, 
            <span className="font-semibold text-blue-600"> sharing</span>, and <span className="font-semibold text-green-600">monetizing</span> innovative ideas.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Target className="text-purple-600" size={24} />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                Every day, brilliant ideas are lost, stolen, or forgotten. We believe that creativity should be rewarded, 
                protected, and accessible to everyone who needs it.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                IdeaVault democratizes innovation by providing creators with the tools to securely document, 
                legally protect, and monetize their intellectual property—all without the complexity and expense 
                of traditional patent systems.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-10 text-white">
              <h3 className="text-3xl font-bold mb-6">Why We Exist</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-yellow-400 mt-1" size={20} />
                  <p>Great ideas deserve protection and fair compensation</p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-green-400 mt-1" size={20} />
                  <p>Innovation should be accessible, not locked behind expensive legal processes</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="text-blue-300 mt-1" size={20} />
                  <p>Global collaboration accelerates human progress</p>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="text-pink-300 mt-1" size={20} />
                  <p>Creators deserve to be rewarded for their ingenuity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From frustrated inventors to platform creators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem</h3>
              <p className="text-gray-600 leading-relaxed">
                Our founders experienced firsthand the frustration of having ideas stolen, being unable to afford 
                patent protection, and watching innovations gather dust because there was no way to connect 
                creators with implementers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Insight</h3>
              <p className="text-gray-600 leading-relaxed">
                We realized that blockchain technology could provide immutable timestamping, while modern 
                digital marketplaces could connect idea creators with businesses looking for innovation—all 
                at a fraction of traditional costs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Award className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">The Solution</h3>
              <p className="text-gray-600 leading-relaxed">
                IdeaVault was born: a platform that combines cryptographic security, legal documentation, 
                and marketplace functionality to create the world's first comprehensive idea protection 
                and monetization ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security First</h3>
              <p className="text-gray-600">
                Your intellectual property is protected with military-grade encryption and blockchain verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Creator Empowerment</h3>
              <p className="text-gray-600">
                We put creators first, ensuring they maintain control and receive fair compensation for their ideas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Access</h3>
              <p className="text-gray-600">
                Innovation knows no borders. Our platform connects creators and businesses worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously evolve our platform to better serve the needs of the creative community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate innovators building the future of intellectual property
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                AJ
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Alex Johnson</h3>
              <p className="text-purple-600 font-semibold mb-4">CEO & Co-Founder</p>
              <p className="text-gray-600 leading-relaxed">
                Former patent attorney turned entrepreneur. Lost 3 ideas to larger companies before founding IdeaVault. 
                Stanford Law, 15+ years IP experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                SM
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sarah Martinez</h3>
              <p className="text-green-600 font-semibold mb-4">CTO & Co-Founder</p>
              <p className="text-gray-600 leading-relaxed">
                Blockchain security expert and former Google engineer. Built the cryptographic systems that power 
                IdeaVault's timestamp verification. MIT Computer Science.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                DK
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">David Kim</h3>
              <p className="text-orange-600 font-semibold mb-4">Head of Product</p>
              <p className="text-gray-600 leading-relaxed">
                Product design veteran from Apple and Airbnb. Obsessed with creating intuitive experiences for 
                complex systems. Carnegie Mellon Design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Impact
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Real numbers from our growing community of innovators
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Join Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 leading-relaxed max-w-4xl mx-auto">
            Be part of a community that values innovation, protects creativity, and rewards ingenuity. 
            Your next great idea deserves a platform that understands its worth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/signup"
              className="px-12 py-5 bg-white text-purple-600 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Protecting Ideas
            </Link>
            <Link
              href="/gallery"
              className="px-12 py-5 border-2 border-white text-white text-xl font-bold rounded-2xl hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
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