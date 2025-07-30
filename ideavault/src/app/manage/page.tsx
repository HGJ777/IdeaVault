// src/app/manage/page.tsx - UPDATED FULL WIDTH VERSION
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useAuth } from '../Context/AuthContext'
import { supabase } from '../lib/supabase'
import { Navigation } from '../components/Navigation'
import { 
  TrendingUp, 
  Eye, 
  EyeOff,
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock, 
  Globe, 
  Calendar,
  BarChart3,
  Lightbulb,
  Star,
  AlertTriangle
} from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number | null
  is_private: boolean
  views: number
  status: 'draft' | 'active' | 'sold'
  created_at: string
}

export default function ManagePage() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'ideas' | 'analytics'>('overview')

  useEffect(() => {
    if (user) {
      fetchUserIdeas()
    }
  }, [user])

  const fetchUserIdeas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setIdeas(data || [])
    } catch (error: any) {
      setError(error.message)
      console.error('Error fetching user ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats with NEW PRIVACY POLICY
  const stats = {
    totalIdeas: ideas.length,
    publicIdeas: ideas.filter(idea => !idea.is_private).length,
    privateIdeas: ideas.filter(idea => idea.is_private).length,
    totalViews: ideas.reduce((sum, idea) => sum + (idea.views || 0), 0),
    monthlyCost: ideas.filter(idea => !idea.is_private).length * 1 // Only charge for public ideas
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation */}
        <Navigation />

        {/* Page Header - FULL WIDTH */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.user_metadata?.full_name || 'Creator'}!
                </h1>
                <p className="text-gray-600 mt-2">Manage your ideas, track performance, and grow your portfolio.</p>
              </div>
              <Link
                href="/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus size={20} />
                New Idea
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs - FULL WIDTH */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-8">
            <div className="flex gap-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'ideas', label: `My Ideas (${ideas.length})` },
                { id: 'analytics', label: 'Analytics' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content - FILLS REMAINING HEIGHT AND FULL WIDTH */}
        <div className="flex-1 w-full px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => setError('')}
                className="mt-2 text-red-600 hover:text-red-700 underline text-sm"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* NEW PRIVACY POLICY NOTICE */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-blue-600" size={20} />
              <h3 className="font-bold text-blue-900">Privacy Policy Update</h3>
            </div>
            <p className="text-blue-800 text-sm font-medium">
              <strong>Important:</strong> Once an idea is made public, it cannot be changed back to private. This protects the integrity of our timestamping system.
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="h-full flex flex-col space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Ideas</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalIdeas}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.privateIdeas} private, {stats.publicIdeas} public</p>
                    </div>
                    <Lightbulb className="text-blue-600" size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
                      <p className="text-xs text-gray-500 mt-1">All time</p>
                    </div>
                    <Eye className="text-green-600" size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Public Ideas</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.publicIdeas}</p>
                      <p className="text-xs text-gray-500 mt-1">With timestamping</p>
                    </div>
                    <Globe className="text-purple-600" size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                      <p className="text-3xl font-bold text-gray-900">${stats.monthlyCost}</p>
                      <p className="text-xs text-gray-500 mt-1">Public ideas only</p>
                    </div>
                    <DollarSign className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Recent Ideas - FILLS REMAINING HEIGHT */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Recent Ideas</h2>
                    <Link
                      href="/create"
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Create New
                    </Link>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  {ideas.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Lightbulb className="text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
                      <p className="text-gray-600 mb-6">Start protecting your intellectual property today!</p>
                      <Link
                        href="/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Create Your First Idea
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4 h-full overflow-y-auto">
                      {ideas.slice(0, 5).map((idea) => (
                        <div key={idea.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-all">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{idea.title}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-gray-600">{idea.category}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(idea.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Eye size={16} />
                              {idea.views || 0}
                            </div>
                            {idea.is_private ? (
                              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                <Lock size={12} />
                                Private (Free)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                <Globe size={12} />
                                Public ($1/mo)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {ideas.length > 5 && (
                        <button
                          onClick={() => setActiveTab('ideas')}
                          className="w-full text-blue-600 hover:text-blue-700 font-medium py-2"
                        >
                          View all {ideas.length} ideas →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Ideas Tab - FULL HEIGHT */}
          {activeTab === 'ideas' && (
            <div className="h-full">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Your Ideas</h2>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {ideas.length} ideas • ${stats.monthlyCost}/month
                      </span>
                      <Link
                        href="/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <Plus size={16} />
                        New Idea
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {ideas.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                      <Lightbulb className="text-gray-400 mb-4" size={64} />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">No ideas yet</h3>
                      <p className="text-gray-600 mb-8">Start building your intellectual property portfolio!</p>
                      <Link
                        href="/create"
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Create Your First Idea
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {ideas.map((idea) => (
                        <div 
                          key={idea.id} 
                          onClick={() => window.location.href = `/idea/${idea.id}`}
                          className="p-8 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{idea.title}</h3>
                                {idea.is_private ? (
                                  <span className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-bold">
                                    <Lock size={16} />
                                    Private (Free)
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                                    <Globe size={16} />
                                    Public ($1/month)
                                  </span>
                                )}
                              </div>
                              
                              {/* Clean Description Preview */}
                              <div className="relative mb-4">
                                <p className="text-lg text-gray-700 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                                  {idea.description.substring(0, 120)}...
                                </p>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white pointer-events-none"></div>
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span className="font-medium">{new Date(idea.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye size={16} />
                                  <span className="font-medium">{idea.views || 0} views</span>
                                </div>
                              </div>

                              {idea.tags && idea.tags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                  {idea.tags.map(tag => (
                                    <span key={tag} className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg font-medium border border-blue-200">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Edit Button */}
                            <div className="ml-8">
                              <Link
                                href={`/edit/${idea.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                                title="Edit Idea"
                              >
                                <Edit3 size={20} />
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab - FULL HEIGHT */}
          {activeTab === 'analytics' && (
            <div className="h-full space-y-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BarChart3 size={24} />
                  Performance Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <TrendingUp className="text-blue-600 mx-auto mb-4" size={32} />
                    <p className="text-3xl font-bold text-blue-600 mb-2">{stats.totalViews}</p>
                    <p className="text-lg font-bold text-gray-700">Total Views</p>
                    <p className="text-sm text-gray-500 mt-1">Across all ideas</p>
                  </div>
                  
                  <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
                    <Globe className="text-green-600 mx-auto mb-4" size={32} />
                    <p className="text-3xl font-bold text-green-600 mb-2">{stats.publicIdeas}</p>
                    <p className="text-lg font-bold text-gray-700">Public Ideas</p>
                    <p className="text-sm text-gray-500 mt-1">With timestamping</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <Lock className="text-gray-600 mx-auto mb-4" size={32} />
                    <p className="text-3xl font-bold text-gray-600 mb-2">{stats.privateIdeas}</p>
                    <p className="text-lg font-bold text-gray-700">Private Ideas</p>
                    <p className="text-sm text-gray-500 mt-1">Free storage</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section - FILLS REMAINING HEIGHT */}
              <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-0">
                {/* Top Performing Ideas */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Star size={20} />
                      Top Performing Ideas
                    </h2>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto">
                    {ideas.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center">
                        <Lightbulb className="text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500 font-medium text-center">No ideas to analyze yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ideas
                          .sort((a, b) => (b.views || 0) - (a.views || 0))
                          .slice(0, 5)
                          .map((idea, index) => (
                            <div key={idea.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{idea.title}</h3>
                                  <p className="text-sm text-gray-600">{idea.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">{idea.views || 0}</p>
                                <p className="text-xs text-gray-500">views</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Monthly Cost Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Monthly Costs</h2>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="space-y-4 h-full">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h3 className="font-bold text-green-900 mb-2">Private Ideas</h3>
                        <p className="text-2xl font-bold text-green-900 mb-1">{stats.privateIdeas}</p>
                        <p className="text-green-700 font-bold">FREE storage</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-green-600">• Dashboard access only</p>
                          <p className="text-xs text-green-600">• Can upgrade to public (one-way)</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-bold text-blue-900 mb-2">Public Ideas</h3>
                        <p className="text-2xl font-bold text-blue-900 mb-1">{stats.publicIdeas} × $1 = ${stats.monthlyCost}/month</p>
                        <p className="text-blue-700 font-bold">With protection & timestamping</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-blue-600">• Marketplace visibility</p>
                          <p className="text-xs text-blue-600">• Cannot revert to private</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg p-4 flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900">Total Monthly Cost</h4>
                          <p className="text-3xl font-bold text-gray-900">${stats.monthlyCost}</p>
                          <p className="text-sm text-gray-600">per month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}