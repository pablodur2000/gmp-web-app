import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { X, Save, Loader2 } from 'lucide-react'
import { InventoryStatus } from '../types'

interface ProductEditFormProps {
  product: any
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

const ProductEditForm = ({ product, onClose, onUpdate, logActivity }: ProductEditFormProps) => {
  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '',
    shortDescription: product.short_description || '',
    price: product.price ? product.price.toString() : '', // Price in UYU (no cents)
    categoryId: product.category_id || '',
    available: product.available ?? true,
    featured: product.featured ?? false,
    inventory_status: product.inventory_status || 'en_stock'
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(product.images || [])
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }



  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'La descripción corta es requerida'
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (files: File[]) => {
    const uploadedUrls: string[] = []
    
    for (const file of files) {
      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
        console.log('Uploading file:', fileName)
        
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, file)
        
        if (error) {
          console.error('Upload error:', error)
          alert(`Error uploading ${file.name}: ${error.message}`)
          continue
        }
        
        console.log('Upload successful:', data)
        
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(fileName)
        
        uploadedUrls.push(urlData.publicUrl)
        console.log('Image URL:', urlData.publicUrl)
        
      } catch (error) {
        console.error('Upload exception:', error)
        alert(`Exception uploading ${file.name}: ${error}`)
      }
    }
    
    console.log('Final uploaded URLs:', uploadedUrls)
    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setUploading(true)
    
    try {
      console.log('Starting product update...')
      
      let finalImages = [...existingImages]
      
      // Upload new images if any
      if (images.length > 0) {
        const newImageUrls = await handleImageUpload(images)
        finalImages = [...existingImages, ...newImageUrls]
      }
      
      // Update product in database
      const { data, error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          short_description: formData.shortDescription,
          price: parseInt(formData.price), // Price in UYU (no cents)
          category_id: formData.categoryId,
          main_category: categories.find(cat => cat.id === formData.categoryId)?.main_category || 'cuero',
          available: formData.available,
          featured: formData.featured,
          inventory_status: formData.inventory_status,
          images: finalImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id)
        .select()
      
      if (error) {
        console.error('Error updating product:', error)
        alert('Error updating product: ' + error.message)
        return
      }
      
      console.log('Product updated successfully:', data)
      
      // Log activity
      console.log('📝 Logging update activity...')
      await logActivity({
        action_type: 'UPDATE',
        resource_type: 'PRODUCT',
        resource_id: product.id,
        resource_name: formData.title,
        details: {
          price: formData.price,
          category: categories.find(c => c.id === formData.categoryId)?.name,
          main_category: categories.find(cat => cat.id === formData.categoryId)?.main_category || 'cuero',
          available: formData.available,
          featured: formData.featured,
          inventory_status: formData.inventory_status,
          image_count: finalImages.length
        }
      })
      console.log('✅ Activity logged successfully')
      
      // Close form and refresh
      onUpdate()
      onClose()
      
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error updating product: ' + error)
    } finally {
      setUploading(false)
    }
  }

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(img => img !== imageUrl))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título del Producto *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Billetera de Cuero Premium"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Completa *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe detalladamente el producto..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción Corta *
        </label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          maxLength={300}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent ${
            errors.shortDescription ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Descripción breve para el catálogo..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.shortDescription.length}/300 caracteres
        </p>
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
      </div>

      {/* Price and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (UYU) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="450.00"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent ${
              errors.categoryId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>

        {/* Main Category Display (Auto-calculated) */}
        {formData.categoryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Artesanía</label>
            <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {categories.find(cat => cat.id === formData.categoryId)?.main_category === 'macrame' ? 'Macramé Artesanal' : 'Artesanías en Cuero'}
            </div>

          </div>
        )}
      </div>

      {/* Options */}
      <div className="flex space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
          />
          <span className="ml-2 text-sm text-gray-700">Disponible</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
          />
          <span className="ml-2 text-sm text-gray-700">Destacado</span>
        </label>

        {/* Inventory Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado de Inventario
          </label>
          <select
            value={formData.inventory_status}
            onChange={(e) => setFormData({...formData, inventory_status: e.target.value as InventoryStatus})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
            required
          >
            <option value="en_stock">En stock</option>
            <option value="por_encargue_con_stock">Por encargo (con stock)</option>
            <option value="por_encargue_sin_stock">Por encargo (sin stock)</option>
            <option value="pieza_unica">Pieza única</option>
            <option value="sin_stock">Sin stock</option>
          </select>
        </div>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes Existentes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agregar Nuevas Imágenes
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {images.length} imagen(es) seleccionada(s)
          </p>
        )}
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
          disabled={uploading}
          className="px-4 py-2 bg-leather-600 text-white rounded-lg hover:bg-leather-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Actualizando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Actualizar Producto</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ProductEditForm
