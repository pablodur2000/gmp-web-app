import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Upload, X } from 'lucide-react'
import { InventoryStatus } from '../types'

interface ProductFormProps {
  onSuccess?: () => void
  logActivity?: (logData: {
    action_type: string
    resource_type: string
    resource_id?: string
    resource_name?: string
    details?: any
  }) => Promise<void>
}

const ProductForm = ({ onSuccess, logActivity }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    categoryId: '',
    available: true,
    featured: false,
    inventory_status: 'disponible_pieza_unica' as InventoryStatus
  })
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  // Load categories on component mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
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
    setUploading(true)
    
    try {
      console.log('Starting product creation...')
      console.log('Images to upload:', images)
      
      // Upload images first (if any)
      let imageUrls: string[] = []
      if (images.length > 0) {
        imageUrls = await handleImageUpload(images)
        console.log('Images uploaded successfully:', imageUrls)
      }
      
      // Create product
      const productData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.shortDescription,
        price: parseInt(formData.price), // Price in UYU (no cents)
        category_id: formData.categoryId,
        main_category: categories.find(cat => cat.id === formData.categoryId)?.main_category || 'cuero',
        available: formData.available,
        featured: formData.featured,
        inventory_status: formData.inventory_status,
        images: imageUrls
      }
      
      console.log('Product data to insert:', productData)
      
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
      
      if (error) {
        console.error('Database error:', error)
        throw error
      }
      
      console.log('Product created successfully:', data)
      
      // Get category name for logging
      const categoryName = categories.find(cat => cat.id === formData.categoryId)?.name || 'Unknown'
      
      // Log the activity if logActivity function is provided
      if (logActivity) {
        await logActivity({
          action_type: 'CREATE',
          resource_type: 'PRODUCT',
          resource_id: data[0].id,
          resource_name: formData.title,
                  details: {
          price: formData.price,
          category: categoryName,
          main_category: categories.find(cat => cat.id === formData.categoryId)?.main_category || 'cuero',
          available: formData.available,
          featured: formData.featured,
          inventory_status: formData.inventory_status,
          image_count: imageUrls.length
          }
        })
      }
      
      // Reset form
      setFormData({
        title: '', 
        description: '', 
        shortDescription: '', 
        price: '', 
        categoryId: '', 
        available: true, 
        featured: false,
        inventory_status: 'disponible_pieza_unica'
      })
      setImages([])
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      } else {
        alert('Product created successfully!')
      }
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      alert('Error creating product: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
          required
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Short Description</label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price (UYU)</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
          required
        />
      </div>

              {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-leather-500 focus:ring-leather-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
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

      {/* Checkboxes */}
      <div className="flex space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.available}
            onChange={(e) => setFormData({...formData, available: e.target.checked})}
            className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
          />
          <span className="ml-2 text-sm text-gray-700">Available</span>
        </label>
        
        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
            className="h-4 w-4 text-leather-600 focus:ring-leather-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
            Producto destacado
          </label>
        </div>

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
            <option value="disponible_pieza_unica">Pieza Única</option>
            <option value="disponible_encargo_mismo_material">Encargo Mismo Material</option>
            <option value="disponible_encargo_diferente_material">Encargo Diferente Material</option>
            <option value="no_disponible">No Disponible</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-leather-600 hover:text-leather-500">
                <span>Upload images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    console.log('Files selected:', files)
                    setImages(files)
                  }}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
        
        {/* Preview selected images */}
        {images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-leather-600 hover:bg-leather-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leather-500 disabled:opacity-50"
      >
        {uploading ? 'Creating Product...' : 'Create Product'}
      </button>
    </form>
  )
}

export default ProductForm
