import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Save, Loader2 } from 'lucide-react'

interface CategoryEditFormProps {
  category: any
  onClose: () => void
  onUpdate: () => void
  logActivity: (logData: {
    action_type: string
    resource_type: string
    resource_id?: string
    resource_name?: string
    details?: any
  }) => Promise<void>
}

const CategoryEditForm = ({ category, onClose, onUpdate, logActivity }: CategoryEditFormProps) => {
  const [formData, setFormData] = useState({
    name: category.name || '',
    description: category.description || '',
    main_category: category.main_category || 'cuero' as 'cuero' | 'macrame'
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    
    if (!formData.main_category) {
      newErrors.main_category = 'El tipo de artesanía es requerido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim(),
          main_category: formData.main_category,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id)
        .select()
      
      if (error) {
        console.error('Error updating category:', error)
        alert('Error actualizando categoría: ' + error.message)
        return
      }
      
      // Log activity
      await logActivity({
        action_type: 'UPDATE',
        resource_type: 'CATEGORY',
        resource_id: category.id,
        resource_name: formData.name,
        details: {
          main_category: formData.main_category,
          description: formData.description
        }
      })
      
      // Close form and refresh
      onUpdate()
      onClose()
      
    } catch (error: any) {
      console.error('Error updating category:', error)
      alert('Error actualizando categoría: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Billeteras"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe la categoría..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Main Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Artesanía *
        </label>
        <select
          value={formData.main_category}
          onChange={(e) => setFormData({...formData, main_category: e.target.value as 'cuero' | 'macrame'})}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.main_category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="cuero">Artesanías en Cuero</option>
          <option value="macrame">Macramé Artesanal</option>
        </select>
        {errors.main_category && <p className="text-red-500 text-sm mt-1">{errors.main_category}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Actualizando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Actualizar Categoría</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default CategoryEditForm
