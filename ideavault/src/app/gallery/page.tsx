// src/app/gallery/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { 
  Search, 
  Filter, 
  DollarSign, 
  ExternalLink,
  Star,
  Calendar,
  Eye
} from 'lucide-react'
import { Navigation } from '../components/Navigation'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  price: number | null
  is_private: boolean
  views: number
  created_at: string
  user_id: string
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Sustainability', label: 'Sustainability' },
  { value: 'Health & Fitness', label: 'Health & Fitness' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Productivity', label: 'Productivity' },
  { value: 'Other', label: 'Other' }
]

export default function BrowsePage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const router = useRouter()

  useEffect(() => {
    fetchPublicIdeas()
  }, [])

  useEffect(() => {
    filterAndSortIdeas()
  }, [ideas, searchTerm, selectedCategory, sortBy])

  const fetchPublicIdeas = async () => {
    try {
      setLoading(true)
      
      // Fetch only public ideas
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      setIdeas(data || [])
    } catch (error: any) {
      setError(error.message)
      console.error('Error fetching ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortIdeas = () => {
    let filtered = ideas.filter(idea => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Sort ideas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'popular':
          return b.views - a.views
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredIdeas(filtered)
  }

  const handleIdeaClick = (ideaId: string) => {
    // Increment view count
    incrementViewCount(ideaId)
    router.push(`/idea/${ideaId}`)
  }

  const incrementViewCount = async (ideaId: string) => {
    try {
      const idea = ideas.find(i => i.id === ideaId)
      if (idea) {
        await supabase
          .from('ideas')
          .update({ views: idea.views + 1 })
          .eq('id', ideaId)
        
        // Update local state
        setIdeas(ideas.map(idea => 
          idea.id === ideaId 
            ? { ...idea, views: idea.views + 1 }
            : idea
        ))
      }
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse <span className="text-blue-600">Ideas</span>
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Discover innovative concepts from creators worldwide
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-4xl mx-auto">
            <p className="text-red-600 text-sm font-bold">Error loading ideas: {error}</p>
            <button 
              onClick={fetchPublicIdeas}
              className="mt-2 text-red-600 hover:text-red-700 underline text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 w-full px-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search innovative ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-52">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none text-gray-900 font-medium"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="w-full md:w-44">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} found
            </span>
          </div>
        </div>

        {/* Ideas List - Full Width Horizontal Rows */}
        <div className="w-full px-2">
          {filteredIdeas.length === 0 ? (
            <div className="bg-white rounded-lg p-16 shadow-sm border border-gray-200 text-center">
              <Search className="mx-auto text-gray-400 mb-6" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {ideas.length === 0 ? 'No public ideas yet' : 'No ideas found'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg font-medium">
                {ideas.length === 0 
                  ? 'Be the first to share your innovative concept publicly!'
                  : 'Try adjusting your search criteria or browse different categories.'
                }
              </p>
              {ideas.length === 0 ? (
                <Link
                  href="/create"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                >
                  Submit Your Idea
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIdeas.map((idea) => (
                <div 
                  key={idea.id} 
                  onClick={() => handleIdeaClick(idea.id)}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    {/* Left Side - Title and Date */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {idea.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1.5">
                          <p className="text-sm font-bold text-gray-600 flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(idea.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                            {idea.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Views Only (No Contact/Price) */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                        <Eye size={16} />
                        <span>{idea.views} views</span>
                      </div>
                      
                      <div className="text-sm text-blue-600 group-hover:text-blue-700 font-bold">
                        View Details →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        {filteredIdeas.length > 0 && (
          <div className="mt-16 w-full px-2 bg-blue-600 rounded-lg p-8 text-white text-center shadow-lg">
            <h3 className="text-3xl font-bold mb-4">Have an innovative idea?</h3>
            <p className="text-blue-100 mb-6 text-lg font-medium">
              Join creators protecting and sharing their breakthrough concepts
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all font-bold shadow-md"
            >
              Submit Your Idea
              <ExternalLink size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}