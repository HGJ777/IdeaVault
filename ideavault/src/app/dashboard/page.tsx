// src/app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Crown,
  Lightbulb,
  Check,
  X
} from 'lucide-react'

// Mock data - replace with real data from Supabase
const mockIdeas = [
  {
    id: 1,
    title: "AI-Powered Recipe Generator",
    description: "An app that creates recipes based on ingredients you have at home, dietary restrictions, and cooking time available.",
    isPrivate: false,
    createdAt: "2025-01-15",
    price: 299,
    views: 43,
    status: "active"
  },
  {
    id: 2,
    title: "Smart Plant Care System",
    description: "IoT sensors that monitor soil moisture, light levels, and plant health, sending notifications to your phone when care is needed.",
    isPrivate: true,
    createdAt: "2025-01-12",
    price: null,
    views: 0,
    status: "draft"
  },
  {
    id: 3,
    title: "Micro-Investment Social Platform",
    description: "Allow users to invest spare change from purchases into friends' small business ideas and track returns socially.",
    isPrivate: false,
    createdAt: "2025-01-08",
    price: 150,
    views: 127,
    status: "sold"
  }
]

export default function DashboardPage() {
  const [ideas, setIdeas] = useState(mockIdeas)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    isPremium: true,
    totalIdeas: 3,
    totalEarnings: 150
  })

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || idea.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDeleteIdea = (ideaId: number) => {
    if (confirm('Are you sure you want to delete this idea?')) {
      setIdeas(ideas.filter(idea => idea.id !== ideaId))
    }
  }

  const togglePrivacy = (ideaId: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId 
        ? { ...idea, isPrivate: !idea.isPrivate }
        : idea
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                IdeaVault
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-purple-600 font-medium">Dashboard</Link>
                <Link href="/submit" className="text-gray-600 hover:text-gray-900">Submit Idea</Link>
                <Link href="/gallery" className="text-gray-600 hover:text-gray-900">Gallery</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {user.isPremium && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                  <Crown size={16} />
                  Premium
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Idea Vault</h1>
          <p className="text-gray-600">Manage, protect, and monetize your creative concepts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lightbulb className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user.totalIdeas}</p>
                <p className="text-sm text-gray-600">Total Ideas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${user.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {ideas.reduce((total, idea) => total + idea.views, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search your ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="all">All Ideas</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Add New Idea Button */}
            <Link
              href="/submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus size={20} />
              New Idea
            </Link>
          </div>
        </div>

        {/* Ideas List */}
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Lightbulb className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No ideas found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? "Try adjusting your search or filter criteria."
                  : "Start building your vault by submitting your first idea!"
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Submit Your First Idea
                </Link>
              )}
            </div>
          ) : (
            filteredIdeas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
                      <div className="flex items-center gap-2">
                        {idea.isPrivate ? (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            <EyeOff size={12} />
                            Private
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                            <Eye size={12} />
                            Public
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          idea.status === 'active' ? 'bg-blue-100 text-blue-600' :
                          idea.status === 'sold' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">{idea.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        {idea.views} views
                      </div>
                      {idea.price && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          ${idea.price}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePrivacy(idea.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title={idea.isPrivate ? "Make Public" : "Make Private"}
                    >
                      {idea.isPrivate ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions Footer */}
        {filteredIdeas.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to submit another idea?</h3>
            <p className="text-purple-100 mb-6">Keep building your vault of protected concepts</p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <Plus size={20} />
              Submit New Idea
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}