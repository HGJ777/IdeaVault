// src/app/idea/[Id]/page.tsx - FIXED FULL WIDTH VERSION
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../Context/AuthContext'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { Navigation } from '../../components/Navigation'
import { 
  ArrowLeft, 
  Eye, 
  Calendar, 
  User,
  Lightbulb,
  Shield,
  Clock,
  Globe,
  Lock,
  Edit3,
  TrendingUp,
  CheckCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react'

interface IdeaUpdate {
  id: string
  content: string
  created_at: string
  update_type: 'feature' | 'improvement' | 'note' | 'licensing'
}

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
  user_id: string
}

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [updates, setUpdates] = useState<IdeaUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // FIXED: Use capital Id instead of lowercase id
  const ideaId = params.Id as string

  useEffect(() => {
    if (ideaId) {
      fetchIdea()
      fetchUpdates()
    }
  }, [ideaId])

  const fetchIdea = async () => {
    try {
      setLoading(true)
      setError('')

      console.log('🔍 Fetching idea details, ID:', ideaId)

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 15 seconds')), 15000)
      )

      // Fetch idea with retry logic
      const fetchPromise = supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        console.log('❌ Supabase error:', error)
        throw error
      }

      if (!data) {
        throw new Error('Idea not found')
      }

      console.log('✅ Idea loaded successfully:', data.title)
      setIdea(data)
      
      // Increment view count if not the owner
      if (user && data.user_id !== user.id) {
        incrementViewCount(data.id)
      }

    } catch (error: any) {
      console.log('❌ Error fetching idea:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_updates')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUpdates(data || [])
    } catch (error: any) {
      console.log('Error fetching updates:', error)
      // Don't show error for updates, just fail silently
    }
  }

  const incrementViewCount = async (ideaId: string) => {
    try {
      const { error } = await supabase.rpc('increment_idea_views', { idea_id: ideaId })
      if (error) {
        console.log('⚠️ Failed to increment view count:', error)
      }
    } catch (error) {
      console.log('⚠️ View count increment error:', error)
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchIdea()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-gray-600 font-medium">
                Loading idea details...
                {retryCount > 0 && ` (Attempt ${retryCount + 1})`}
              </span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <div className="flex-1 w-full px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <Shield className="text-red-600 mx-auto mb-4" size={48} />
              <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Idea</h1>
              <p className="text-red-600 mb-6 font-medium">{error}</p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors font-bold flex items-center gap-2"
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
                <Link
                  href="/explore"
                  className="bg-gray-600 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors font-bold"
                >
                  Browse Ideas
                </Link>
              </div>
              
              {retryCount > 2 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">
                    Still having trouble? Try refreshing the page or check your internet connection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!idea) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <div className="flex-1 w-full px-8 py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
              <Lightbulb className="text-gray-400 mx-auto mb-4" size={48} />
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Idea Not Found</h1>
              <p className="text-gray-600 mb-6 font-medium">
                The idea you're looking for doesn't exist or may have been removed.
              </p>
              <Link
                href="/explore"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold"
              >
                Browse Other Ideas
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const isOwner = user && idea.user_id === user.id

  const updateTypes = [
    { value: 'feature', label: '🚀 New Feature', color: 'blue' },
    { value: 'improvement', label: '⚡ Improvement', color: 'green' },
    { value: 'note', label: '💭 Note', color: 'gray' },
    { value: 'licensing', label: '💼 Licensing', color: 'purple' }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        
        {/* FULL WIDTH CONTAINER */}
        <div className="flex-1 w-full px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-bold"
            >
              <ArrowLeft size={20} />
              Back to Browse
            </Link>
            
            {isOwner && (
              <Link
                href={`/edit/${idea.id}`}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold flex items-center gap-2"
              >
                <Edit3 size={20} />
                Edit Idea
              </Link>
            )}
          </div>

          {/* Main Content - FULL WIDTH GRID */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Idea Content - TAKES UP 3 COLUMNS */}
            <div className="lg:col-span-3 space-y-8">
              {/* Title & Description */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {idea.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                      {idea.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="font-medium">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span className="font-medium">{idea.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed text-lg font-medium">
                    {idea.description}
                  </p>
                </div>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-3">
                      {idea.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Updates Timeline */}
              {updates.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="text-green-600" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900">Updates & Evolution</h2>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      {updates.length} updates
                    </span>
                  </div>

                  <div className="space-y-4">
                    {updates.map((update, index) => {
                      const typeConfig = updateTypes.find(t => t.value === update.update_type) || updateTypes[0]
                      return (
                        <div key={update.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                typeConfig.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                typeConfig.color === 'green' ? 'bg-green-100 text-green-800' :
                                typeConfig.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {typeConfig.label}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                {new Date(update.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 font-medium leading-relaxed">{update.content}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Creator Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Creator</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Anonymous Creator</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle size={14} />
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Idea Status */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Idea Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Visibility</span>
                    <div className="flex items-center gap-2">
                      {idea.is_private ? (
                        <>
                          <Lock className="text-gray-600" size={16} />
                          <span className="text-sm font-bold text-gray-600">Private</span>
                        </>
                      ) : (
                        <>
                          <Globe className="text-green-600" size={16} />
                          <span className="text-sm font-bold text-green-600">Public</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Protection Level</span>
                    <div className="flex items-center gap-2">
                      <Shield className="text-blue-600" size={16} />
                      <span className="text-sm font-bold text-blue-600">
                        {idea.is_private ? 'Basic Storage' : 'Full Protection'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Created</span>
                    <div className="flex items-center gap-2">
                      <Clock className="text-purple-600" size={16} />
                      <span className="text-sm font-bold text-purple-600">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Views</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-orange-600" size={16} />
                      <span className="text-sm font-bold text-orange-600">{idea.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action for Non-Owners */}
              {!isOwner && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">Got an Idea?</h3>
                  <p className="text-sm text-blue-800 mb-4 font-medium">
                    Protect your intellectual property and join thousands of innovators.
                  </p>
                  <Link
                    href="/create"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold text-center block"
                  >
                    Submit Your Idea
                  </Link>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200 p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-3">Manage Your Idea</h3>
                  <div className="space-y-3">
                    <Link
                      href={`/edit/${idea.id}`}
                      className="w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors font-bold text-center block"
                    >
                      Edit Idea
                    </Link>
                    <Link
                      href="/manage"
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-xl hover:bg-gray-700 transition-colors font-bold text-center block"
                    >
                      View Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}