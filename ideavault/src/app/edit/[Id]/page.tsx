// src/app/edit/[Id]/page.tsx - PART 1: IMPORTS & SETUP
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useAuth } from '../../Context/AuthContext'
import { supabase } from '../../lib/supabase'
import { Navigation } from '../../components/Navigation'
import { StripeCheckout } from '../../components/StripeCheckout'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Lock,
  Globe,
  DollarSign,
  Shield,
  X,
  AlertTriangle,
  Plus,
  Calendar,
  User,
  MessageSquare,
  Clock,
  Edit,
  CreditCard
} from 'lucide-react'

interface IdeaFormData {
  title: string
  description: string
  categories: string[]
  is_private: boolean
}

interface IdeaUpdate {
  id: string
  content: string
  created_at: string
  update_type: 'feature' | 'improvement' | 'note' | 'licensing'
}

export default function EditIdeaPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [originalIdea, setOriginalIdea] = useState<any>(null)
  const [updates, setUpdates] = useState<IdeaUpdate[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStripeCheckout, setShowStripeCheckout] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [newUpdate, setNewUpdate] = useState('')
  const [updateType, setUpdateType] = useState<'feature' | 'improvement' | 'note' | 'licensing'>('feature')
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null)
  const [editUpdateContent, setEditUpdateContent] = useState('')
  const [editUpdateType, setEditUpdateType] = useState<'feature' | 'improvement' | 'note' | 'licensing'>('feature')

  const ideaId = params.Id as string

  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    description: '',
    categories: [],
    is_private: true
  })

  const availableCategories = [
    'Technology', 'Finance', 'Education', 'Sustainability', 'Health & Fitness',
    'Entertainment', 'E-commerce', 'Marketing', 'Real Estate', 'Food & Beverage',
    'Transportation', 'Fashion', 'Travel', 'Gaming', 'Social Media', 'Productivity', 'Other'
  ]

  const updateTypes = [
    { value: 'feature', label: '🚀 New Feature', color: 'blue' },
    { value: 'improvement', label: '⚡ Improvement', color: 'green' },
    { value: 'note', label: '💭 Note', color: 'gray' },
    { value: 'licensing', label: '💼 Licensing', color: 'purple' }
  ]

  useEffect(() => {
    if (ideaId && user) {
      fetchIdea()
      fetchUpdates()
    }
  }, [ideaId, user])

  const fetchIdea = async () => {
    try {
      setLoading(true)
      setError('')

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
      )

      const fetchPromise = supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .eq('user_id', user?.id)
        .single()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Idea not found or you do not have permission to edit it')
        }
        throw error
      }

      if (!data) {
        throw new Error('Idea not found or you do not have permission to edit it')
      }

      setOriginalIdea(data)
      setFormData({
        title: data.title,
        description: data.description,
        categories: data.tags || [],
        is_private: data.is_private
      })
    } catch (error: any) {
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
    }
  }

  const addUpdate = async () => {
    if (!newUpdate.trim()) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('idea_updates')
        .insert({
          idea_id: ideaId,
          user_id: user?.id,
          content: newUpdate.trim(),
          update_type: updateType
        })

      if (error) throw error

      setNewUpdate('')
      setSuccess('Update added successfully!')
      fetchUpdates()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // FIXED: Handle privacy change with Stripe payment
  const handlePrivacyChange = (newPrivacyValue: boolean) => {
    const wasPrivate = originalIdea?.is_private
    const becomingPublic = wasPrivate && !newPrivacyValue
    const becomingPrivate = !wasPrivate && newPrivacyValue
    
    if (becomingPrivate) {
      setError('Public ideas cannot be changed back to private. This protects the timestamping integrity.')
      return
    }
    
    if (becomingPublic) {
      // Show Stripe checkout instead of warning modal
      setShowStripeCheckout(true)
      return
    }
    
    setFormData(prev => ({ ...prev, is_private: newPrivacyValue }))
  }

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    try {
      setShowStripeCheckout(false)
      
      // Update the idea to public
      const { error } = await supabase
        .from('ideas')
        .update({
          is_private: false,
          billing_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .eq('user_id', user?.id)

      if (error) throw error

      setFormData(prev => ({ ...prev, is_private: false }))
      
      // Update originalIdea only if it exists
      if (originalIdea) {
        setOriginalIdea({ ...originalIdea, is_private: false })
      }
      
      setSuccess('🎉 Idea is now public and protected! Your IP timestamping is active.')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const addCategory = (category: string) => {
    if (!formData.categories.includes(category) && formData.categories.length < 5) {
      const newCategories = [...formData.categories, category]
      setFormData(prev => ({
        ...prev,
        categories: newCategories
      }))
      
      // Auto-save categories
      saveCategoriesOnly(newCategories)
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    const newCategories = formData.categories.filter(category => category !== categoryToRemove)
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }))
    
    // Auto-save categories
    saveCategoriesOnly(newCategories)
  }

  const saveCategoriesOnly = async (categories: string[]) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({
          category: categories[0] || '',
          tags: categories,
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .eq('user_id', user?.id)

      if (error) throw error
    } catch (error: any) {
      console.error('Error auto-saving categories:', error)
    }
  }

// src/app/edit/[Id]/page.tsx - PART 2: MAIN COMPONENT & FUNCTIONS
// (Continue from Part 1...)

  const startEditingUpdate = (update: IdeaUpdate) => {
    // Check if update was created today
    const updateDate = new Date(update.created_at)
    const today = new Date()
    const isToday = updateDate.toDateString() === today.toDateString()
    
    if (!isToday) {
      setError('Updates can only be edited on the same day they were created. You can delete this update and create a new one instead.')
      return
    }
    
    setEditingUpdate(update.id)
    setEditUpdateContent(update.content)
    setEditUpdateType(update.update_type)
  }

  const cancelEditingUpdate = () => {
    setEditingUpdate(null)
    setEditUpdateContent('')
  }

  const saveUpdateEdit = async (updateId: string) => {
    if (!editUpdateContent.trim()) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('idea_updates')
        .update({
          content: editUpdateContent.trim(),
          update_type: editUpdateType
        })
        .eq('id', updateId)
        .eq('user_id', user?.id)

      if (error) throw error

      setEditingUpdate(null)
      setEditUpdateContent('')
      setSuccess('Update edited successfully!')
      fetchUpdates()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return

    try {
      const { error } = await supabase
        .from('idea_updates')
        .delete()
        .eq('id', updateId)
        .eq('user_id', user?.id)

      if (error) throw error
      
      setSuccess('Update deleted successfully!')
      fetchUpdates()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (formData.categories.length === 0) {
        throw new Error('At least one category is required')
      }

      const wasPrivate = originalIdea?.is_private
      const becomingPrivate = !wasPrivate && formData.is_private
      
      if (becomingPrivate) {
        throw new Error('Public ideas cannot be changed back to private once published.')
      }

      // Update categories and privacy
      const { error } = await supabase
        .from('ideas')
        .update({
          category: formData.categories[0],
          tags: formData.categories,
          is_private: formData.is_private,
          updated_at: new Date().toISOString()
        })
        .eq('id', ideaId)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error updating idea:', error)
        throw new Error(error.message)
      }

      setSuccess('Idea updated successfully!')

    } catch (error: any) {
      console.error('Error updating idea:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', user?.id)

      if (error) {
        console.error('Error deleting idea:', error)
        throw new Error(error.message)
      }

      router.push('/manage')
    } catch (error: any) {
      console.error('Error deleting idea:', error)
      setError(error.message)
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600 font-medium">Loading idea timeline...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !originalIdea) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 w-full px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Idea</h1>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchIdea}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold"
              >
                Try Again
              </button>
              <Link
                href="/manage"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-bold"
              >
                Back to Manage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        
        <div className="flex-1 w-full px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/manage"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors font-bold"
              >
                <ArrowLeft size={20} />
                Back to Manage
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">Idea Timeline</h1>
              <p className="text-gray-600 mt-2 font-medium">
                Original content is protected. Add updates to evolve your idea.
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-bold">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-800 font-bold">{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Original Idea */}
            <div className="lg:col-span-2 space-y-8">
              {/* Original Idea Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Original Idea (Protected)</h2>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Lock size={14} />
                    Immutable
                  </div>
                </div>
                
                {/* Locked Title */}
                <div className="mb-6">
                  <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-gray-500" />
                    Title (Locked)
                  </label>
                  <div className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium text-lg">
                    {formData.title}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    🛡️ Locked for IP protection - Original timestamp: {new Date(originalIdea?.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Locked Description */}
                <div className="mb-6">
                  <label className="block text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Lock size={16} className="text-gray-500" />
                    Description (Locked)
                  </label>
                  <div className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium text-lg leading-relaxed min-h-32">
                    {formData.description}
                  </div>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    🔒 Protected content - Cannot be modified to maintain IP integrity
                  </p>
                </div>

                {/* Editable Categories */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Categories (Editable)
                  </label>
                  
                  {/* Selected Categories Display */}
                  {formData.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-3">
                        {formData.categories.map(category => (
                          <span
                            key={category}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-200"
                          >
                            {category}
                            <X 
                              size={16} 
                              className="cursor-pointer hover:text-blue-600" 
                              onClick={() => removeCategory(category)}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      disabled={formData.categories.length >= 5}
                      className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed bg-white text-lg"
                    >
                      <span>
                        {formData.categories.length >= 5 
                          ? 'Maximum 5 categories selected' 
                          : 'Select a category to add...'}
                      </span>
                      <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {dropdownOpen && formData.categories.length < 5 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {availableCategories
                          .filter(category => !formData.categories.includes(category))
                          .map(category => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                addCategory(category)
                                setDropdownOpen(false)
                              }}
                              className="w-full px-6 py-3 text-left hover:bg-blue-50 hover:text-blue-800 font-medium text-gray-900 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {category}
                            </button>
                          ))}
                      </div>
                    )}
                    
                    {dropdownOpen && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setDropdownOpen(false)}
                      ></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    {formData.categories.length}/5 categories selected
                  </p>
                </div>
              </div>

              {/* Updates Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-green-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Updates & Evolution</h2>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    {updates.length} updates
                  </span>
                </div>

                {/* Add New Update */}
                <div className="border border-dashed border-gray-300 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Plus className="text-blue-600" size={20} />
                    <h3 className="font-bold text-gray-900">Add Update</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Update Type Selector */}
                    <div className="flex gap-2 flex-wrap">
                      {updateTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setUpdateType(type.value as any)}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            updateType === type.value
                              ? `bg-${type.color}-100 text-${type.color}-800 border border-${type.color}-200`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {/* Update Content */}
                    <textarea
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      placeholder="Describe your update, new feature, improvement, or note..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-gray-900"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">{newUpdate.length}/500 characters</p>
                      <button
                        onClick={addUpdate}
                        disabled={!newUpdate.trim() || saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            Add Update
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Updates List */}
                <div className="space-y-4">
                  {updates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="font-medium">No updates yet. Add your first update above!</p>
                    </div>
                  ) : (
                    updates.map((update, index) => {
                      const typeConfig = updateTypes.find(t => t.value === update.update_type) || updateTypes[0]
                      const isEditing = editingUpdate === update.id
                      
                      return (
                        <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {isEditing ? (
                                <div className="flex gap-2">
                                  {updateTypes.map(type => (
                                    <button
                                      key={type.value}
                                      type="button"
                                      onClick={() => setEditUpdateType(type.value as any)}
                                      className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                                        editUpdateType === type.value
                                          ? `bg-${type.color}-100 text-${type.color}-800 border border-${type.color}-200`
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                    >
                                      {type.label}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  typeConfig.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                  typeConfig.color === 'green' ? 'bg-green-100 text-green-800' :
                                  typeConfig.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {typeConfig.label}
                                </span>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                {new Date(update.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {!isEditing && (
                              <div className="flex gap-2">
                                {(() => {
                                  const updateDate = new Date(update.created_at)
                                  const today = new Date()
                                  const isToday = updateDate.toDateString() === today.toDateString()
                                  
                                  return (
                                    <>
                                      <button
                                        onClick={() => startEditingUpdate(update)}
                                        disabled={!isToday}
                                        className={`p-1 rounded transition-colors ${
                                          isToday 
                                            ? 'text-blue-600 hover:text-blue-700' 
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        title={isToday ? 'Edit update' : 'Can only edit updates created today'}
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() => deleteUpdate(update.id)}
                                        className="text-red-600 hover:text-red-700 p-1 rounded"
                                        title="Delete update"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </>
                                  )
                                })()}
                              </div>
                            )}
                          </div>
                          
                          {isEditing ? (
                            <div className="space-y-3">
                              <textarea
                                value={editUpdateContent}
                                onChange={(e) => setEditUpdateContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-gray-900"
                                rows={3}
                                maxLength={500}
                              />
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">{editUpdateContent.length}/500 characters</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={cancelEditingUpdate}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => saveUpdateEdit(update.id)}
                                    disabled={!editUpdateContent.trim() || saving}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                                  >
                                    {saving ? 'Saving...' : 'Save'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-700 font-medium leading-relaxed">{update.content}</p>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Privacy & Actions */}
            <div className="space-y-6">
              {/* Privacy Settings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Visibility</h2>
                
                <div className={`rounded-lg p-6 border-2 ${formData.is_private ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {formData.is_private ? <Lock className="text-green-600" size={24} /> : <Globe className="text-blue-600" size={24} />}
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {formData.is_private ? 'Private Idea' : 'Public Idea'}
                        </h3>
                        <p className="text-gray-700 font-medium text-sm">
                          {formData.is_private 
                            ? 'Only visible in your dashboard - FREE'
                            : 'Visible in marketplace - $1/month'
                          }
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!formData.is_private}
                        onChange={(e) => handlePrivacyChange(!e.target.checked)}
                        className="sr-only peer"
                        disabled={!originalIdea?.is_private && !formData.is_private}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    </label>
                  </div>

                  {!originalIdea?.is_private && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="text-yellow-600" size={16} />
                        <span className="font-bold text-yellow-900 text-sm">Policy Notice</span>
                      </div>
                      <p className="text-yellow-800 text-xs font-medium">
                        This idea is public and cannot be reverted to private.
                      </p>
                    </div>
                  )}

                  <div className={`p-4 rounded-lg ${formData.is_private ? 'bg-green-100' : 'bg-blue-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className={formData.is_private ? 'text-green-600' : 'text-blue-600'} size={16} />
                      <span className={`font-bold ${formData.is_private ? 'text-green-900' : 'text-blue-900'}`}>
                        {formData.is_private ? 'FREE Storage' : '$1.00/month'}
                      </span>
                    </div>
                    <ul className={`text-xs space-y-1 ${formData.is_private ? 'text-green-700' : 'text-blue-700'}`}>
                      {formData.is_private ? (
                        <>
                          <li className="font-medium">• Dashboard access only</li>
                          <li className="font-medium">• Can upgrade to public (one-way)</li>
                        </>
                      ) : (
                        <>
                          <li className="font-medium">• Marketplace visibility</li>
                          <li className="font-medium">• Timestamped & protected</li>
                          <li className="font-medium">• Cannot revert to private</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Save Privacy Changes Button */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Save Changes</h3>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Privacy & Categories
                    </>
                  )}
                </button>
              </div>

              {/* Original Info */}
              {originalIdea && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Original Submission
                  </h3>
                  <p className="text-blue-800 text-sm font-medium">
                    🛡️ Protected since {new Date(originalIdea.created_at).toLocaleDateString()} at {new Date(originalIdea.created_at).toLocaleTimeString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  href={`/idea/${ideaId}`}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-bold text-center block"
                >
                  Preview Idea
                </Link>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-red-600" size={20} />
                  <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <div className="mb-3">
                    <h3 className="font-bold text-red-900 mb-1">Delete This Idea</h3>
                    <p className="text-sm text-red-700 font-medium">
                      Permanently delete this idea and all its updates. This cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleting}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Idea
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe Checkout Modal - REPLACES WARNING MODAL */}
          {showStripeCheckout && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Enable IP Protection</h2>
                    <button
                      onClick={() => setShowStripeCheckout(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <StripeCheckout
                    ideaId={ideaId}
                    ideaTitle={formData.title}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowStripeCheckout(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="text-red-600" size={28} />
                  <h3 className="text-xl font-bold text-red-900">Confirm Deletion</h3>
                </div>
                
                <p className="text-gray-700 mb-6 font-medium">
                  Are you absolutely sure you want to delete "<strong>{formData.title}</strong>" and all its updates? 
                  This action cannot be undone and you will lose all IP protection for this idea.
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-bold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Forever
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}