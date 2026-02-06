import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface CategoryFormProps {
  onSuccess?: () => void
  logActivity?: (logData: {
    action_type: string
    resource_type: string
    resource_id?: string
    resource_name?: string
    details?: any
  }) => Promise<void>
}

const CategoryForm = ({ onSuccess, logActivity }: CategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    main_category: 'cuero' as 'cuero' | 'macrame'
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
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim(),
          main_category: formData.main_category
        }])
        .select()
      
      if (error) {
        console.error('Error creating category:', error)
        alert('Error creando categoría: ' + error.message)
        return
      }
      
      // Log activity if logActivity function is provided
      if (logActivity && data[0]) {
        await logActivity({
          action_type: 'CREATE',
          resource_type: 'CATEGORY',
          resource_id: data[0].id,
          resource_name: formData.name,
          details: {
            main_category: formData.main_category,
            description: formData.description
          }
        })
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        main_category: 'cuero'
      })
      setErrors({})
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        alert('Categoría creada exitosamente!')
      }
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      alert('Error creando categoría: ' + error.message)
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
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Billeteras"
          required
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
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe la categoría..."
          required
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
          required
        >
          <option value="cuero">Artesanías en Cuero</option>
          <option value="macrame">Macramé Artesanal</option>
        </select>
        {errors.main_category && <p className="text-red-500 text-sm mt-1">{errors.main_category}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {submitting ? 'Creando Categoría...' : 'Crear Categoría'}
      </button>
    </form>
  )
}

export default CategoryForm
