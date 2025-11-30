import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogOut, Plus, Edit, Package, X, CheckCircle } from 'lucide-react'
import ProductForm from '../components/ProductForm'
import ProductEditForm from '../components/ProductEditForm'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import SearchBar from '../components/SearchBar'

const AdminDashboardPage = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showProductsCatalog, setShowProductsCatalog] = useState(false)
  const [showSalesView, setShowSalesView] = useState(false)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [sales, setSales] = useState<any[]>([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [saleSearchTerm, setSaleSearchTerm] = useState('')
  const [activitySearchTerm, setActivitySearchTerm] = useState('')
  const [activityFilter, setActivityFilter] = useState<string>('all')
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [deletingProduct, setDeletingProduct] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)



  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      loadRecentActivity()
      loadProducts() // Load products for the total count
    }
  }, [user])

  // Load products when catalog is shown
  useEffect(() => {
    if (showProductsCatalog) {
      loadProducts()
    }
  }, [showProductsCatalog])

  // Load sales when sales view is shown
  useEffect(() => {
    if (showSalesView) {
      loadSales()
    }
  }, [showSalesView])

  // Search activity when search term or filter changes
  useEffect(() => {
    if (activitySearchTerm || activityFilter !== 'all') {
      searchActivity()
    } else {
      loadRecentActivity()
    }
  }, [activitySearchTerm, activityFilter])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/admin/login')
        return
      }

      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (adminError || !adminData) {
        navigate('/admin/login')
        return
      }

      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const loadRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) {
        console.error('Error loading activity:', error)
        return
      }
      
      setRecentActivity(data || [])
    } catch (error) {
      console.error('Error loading activity:', error)
    }
  }

  const loadProducts = async () => {
    setLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error loading products:', error)
        return
      }
      
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadSales = async () => {
    setLoadingSales(true)
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
      
      if (error) {
        console.error('Error loading sales:', error)
        return
      }
      
      setSales(data || [])
    } catch (error) {
      console.error('Error loading sales:', error)
    } finally {
      setLoadingSales(false)
    }
  }

  const searchProducts = async () => {
    if (!productSearchTerm.trim()) {
      loadProducts() // Load all products if search is empty
      return
    }
    
    setLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .ilike('title', `%${productSearchTerm}%`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error searching products:', error)
        return
      }
      
      setProducts(data || [])
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setLoadingProducts(false)
    }
  }

  const searchSales = async () => {
    if (!saleSearchTerm.trim()) {
      loadSales() // Load all sales if search is empty
      return
    }
    
    setLoadingSales(true)
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .ilike('customer_name', `%${saleSearchTerm}%`)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
      
      if (error) {
        console.error('Error searching sales:', error)
        return
      }
      
      setSales(data || [])
    } catch (error) {
      console.error('Error searching sales:', error)
    } finally {
      setLoadingSales(false)
    }
  }

  const searchActivity = async () => {
    if (!activitySearchTerm.trim() && activityFilter === 'all') {
      loadRecentActivity()
      return
    }
    
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
      
      // Apply search filter
      if (activitySearchTerm.trim()) {
        query = query.or(`resource_name.ilike.%${activitySearchTerm}%,user_email.ilike.%${activitySearchTerm}%`)
      }
      
      // Apply action type filter
      if (activityFilter !== 'all') {
        query = query.eq('action_type', activityFilter)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error searching activity:', error)
        return
      }
      
      setRecentActivity(data || [])
    } catch (error) {
      console.error('Error searching activity:', error)
    }
  }

  const updateSaleStatus = async (saleId: string, newStatus: string) => {
    try {
      console.log('🔄 Updating sale status...', { saleId, newStatus })
      
      // Get current sale details for logging
      const currentSale = sales.find(s => s.id === saleId)
      if (!currentSale) {
        console.error('❌ Sale not found:', saleId)
        return
      }
      
      const previousStatus = currentSale.status
      
      // Update sale status in database
      const { error } = await supabase
        .from('sales')
        .update({ 
          status: newStatus,
          sold: newStatus === 'completado' // Auto-update sold field based on status
        })
        .eq('id', saleId)
      
      if (error) {
        console.error('❌ Error updating sale status:', error)
        alert('Error updating sale status: ' + error.message)
        return
      }
      
      console.log('✅ Sale status updated successfully')
      
      // Log activity with meaningful information
      await logActivity({
        action_type: 'UPDATE',
        resource_type: 'SALE',
        resource_id: saleId,
        resource_name: currentSale.customer_name,
        details: {
          action: 'Status Updated',
          customer_name: currentSale.customer_name,
          total_amount: currentSale.total_amount,
          previous_status: previousStatus,
          new_status: newStatus,
          sold: newStatus === 'completado'
        }
      })
      
      // Refresh sales data
      loadSales()
      
    } catch (error) {
      console.error('❌ Error updating sale status:', error)
      alert('Error updating sale status: ' + error)
    }
  }

  const deleteActivityLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', logId)
      
      if (error) {
        console.error('Error deleting activity log:', error)
        return
      }
      
      // Refresh activity logs
      loadRecentActivity()
      
      // Show success popup
      setShowDeleteSuccess(true)
      setTimeout(() => setShowDeleteSuccess(false), 1000)
      
      console.log('Activity log deleted successfully:', logId)
    } catch (error) {
      console.error('Error deleting activity log:', error)
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
  }

  const handleDeleteProduct = (product: any) => {
    setDeletingProduct(product)
    setShowDeleteModal(true)
  }

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return
    
    try {
      console.log('🗑️ Starting product deletion...', deletingProduct)
      
      // Delete product from database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deletingProduct.id)
      
      if (error) {
        console.error('❌ Error deleting product:', error)
        alert('Error deleting product: ' + error.message)
        return
      }
      
      console.log('✅ Product deleted from database successfully')
      
      // Log activity
      console.log('📝 Logging delete activity...')
      await logActivity({
        action_type: 'DELETE',
        resource_type: 'PRODUCT',
        resource_id: deletingProduct.id,
        resource_name: deletingProduct.title,
        details: {
          price: deletingProduct.price.toString(),
          category: deletingProduct.categories?.name,
          available: deletingProduct.available,
          featured: deletingProduct.featured,
          image_count: deletingProduct.images?.length || 0
        }
      })
      
      console.log('✅ Activity logged successfully')
      
      // Refresh products
      loadProducts()
      
      // Show success message
      setShowDeleteSuccess(true)
      setTimeout(() => setShowDeleteSuccess(false), 1000)
      
      // Close modal
      setShowDeleteModal(false)
      setDeletingProduct(null)
      
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      alert('Error deleting product: ' + error)
    }
  }

  const logActivity = async (logData: {
    action_type: string
    resource_type: string
    resource_id?: string
    resource_name?: string
    details?: any
  }) => {
    try {
      console.log('🔄 Starting activity logging...', logData)
      
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user)
      
      if (!user) {
        console.error('❌ No user found for activity logging')
        return
      }
      
      const logEntry = {
        user_id: user.id,
        user_email: user.email,
        action_type: logData.action_type,
        resource_type: logData.resource_type,
        resource_id: logData.resource_id,
        resource_name: logData.resource_name,
        details: logData.details
      }
      
      console.log('📝 Inserting log entry:', logEntry)
      
      const { data, error } = await supabase.from('activity_logs').insert([logEntry])
      
      if (error) {
        console.error('❌ Error inserting activity log:', error)
        throw error
      }
      
      console.log('✅ Activity logged successfully:', data)
      console.log('📊 Log data:', logData)
      
    } catch (error: any) {
      console.error('❌ Error logging activity:', error)
      // Don't fail the main operation if logging fails
      console.error('🔍 Full error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })
    }
  }

  // Helper function to format action text
  const formatActionText = (actionType: string, resourceType: string, resourceName?: string) => {
    const actionMap: { [key: string]: string } = {
      'CREATE': 'Creó',
      'UPDATE': 'Actualizó',
      'DELETE': 'Eliminó'
    }
    
    const resourceMap: { [key: string]: string } = {
      'PRODUCT': 'Producto',
      'CATEGORY': 'Categoría',
      'USER': 'Usuario',
      'SALE': 'Venta'
    }
    
    const action = actionMap[actionType] || actionType
    const resource = resourceMap[resourceType] || resourceType
    
    if (resourceName) {
      return `${action} ${resource}: "${resourceName}"`
    }
    
    return `${action} ${resource}`
  }

  // Helper function to format activity details
  const formatActivityDetails = (details: any) => {
    const formattedDetails: string[] = []
    
    // Handle sale-specific details
    if (details.action) {
      formattedDetails.push(`Acción: ${details.action}`)
    }
    
    if (details.customer_name) {
      formattedDetails.push(`Cliente: ${details.customer_name}`)
    }
    
    if (details.total_amount) {
      formattedDetails.push(`Monto: $${details.total_amount}`)
    }
    
    if (details.previous_sold_status !== undefined && details.new_sold_status !== undefined) {
      formattedDetails.push(`Estado: ${details.previous_sold_status ? 'Vendido' : 'No Vendido'} → ${details.new_sold_status ? 'Vendido' : 'No Vendido'}`)
    }
    
    // Handle status field changes
    if (details.previous_status && details.new_status) {
      formattedDetails.push(`Status: ${details.previous_status} → ${details.new_status}`)
    }
    
    // Handle product-specific details
    if (details.price) {
      formattedDetails.push(`Precio: $${details.price}`)
    }
    
    if (details.category) {
      formattedDetails.push(`Categoría: ${details.category}`)
    }
    
    if (details.available !== undefined) {
      formattedDetails.push(`Disponible: ${details.available ? 'Sí' : 'No'}`)
    }
    
    if (details.featured !== undefined) {
      formattedDetails.push(`Destacado: ${details.featured ? 'Sí' : 'No'}`)
    }
    
    if (details.image_count) {
      formattedDetails.push(`Imágenes: ${details.image_count}`)
    }
    
    return formattedDetails.map((detail, index) => (
      <span key={index} className="inline-block mr-3 mb-1 px-2 py-1 bg-gray-100 rounded text-xs">
        {detail}
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leather-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-leather-800">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600">
                Bienvenido de vuelta, {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Popup */}
      {showDeleteSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Operación completada exitosamente</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Productos</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Left side - Add buttons */}
              <div className="md:col-span-2 space-y-4">
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-leather-400 hover:bg-leather-50 transition-colors duration-200 w-full"
                >
                  <Plus className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Agregar Producto</span>
                </button>
                

              </div>
              
              {/* Right side - View/Manage buttons */}
              <div className="md:col-span-2 space-y-4">
                <button 
                  onClick={() => setShowProductsCatalog(!showProductsCatalog)}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded-lg transition-colors duration-200 w-full ${
                    showProductsCatalog 
                      ? 'border-leather-500 bg-leather-100 text-leather-700' 
                      : 'border-gray-300 hover:border-leather-400 hover:bg-leather-50 text-gray-600'
                  }`}
                >
                  {showProductsCatalog ? (
                    <>
                      <X className="w-5 h-5 text-leather-600" />
                      <span>Ocultar Productos</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5 text-gray-400" />
                      <span>Gestionar Productos</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={() => setShowSalesView(!showSalesView)}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded-lg transition-colors duration-200 w-full ${
                    showSalesView 
                      ? 'border-leather-500 bg-leather-100 text-leather-700' 
                      : 'border-gray-300 hover:border-leather-400 hover:bg-leather-50 text-gray-600'
                  }`}
                >
                  {showSalesView ? (
                    <>
                      <X className="w-5 h-5 text-leather-600" />
                      <span>Ocultar Ventas</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Ver Ventas</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Products Catalog / Sales View */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {showProductsCatalog ? 'Catálogo de Productos' : 
               showSalesView ? 'Ventas' : 'Actividad Reciente'}
            </h2>
          </div>
          <div className="p-6">
            {showProductsCatalog ? (
              // Products Catalog View
              <div>
                {/* Search Bar for Products */}
                <div className="mb-6">
                  <SearchBar
                    value={productSearchTerm}
                    onChange={setProductSearchTerm}
                    onSearch={searchProducts}
                    placeholder="Buscar productos por nombre... (Presiona Enter)"
                  />
                </div>
                
                {loadingProducts ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leather-600"></div>
                  </div>
                ) : products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {productSearchTerm ? `No se encontraron productos que coincidan con "${productSearchTerm}"` : 'No se encontraron productos. ¡Crea tu primer producto!'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {product.title}
                          </h3>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800 text-xs hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product)}
                              className="text-red-600 hover:text-red-800 text-xs hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                        
                        {product.images && product.images.length > 0 && (
                          <div className="mb-3">
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                        
                        <div className="space-y-2 text-xs text-gray-600">
                          <p className="line-clamp-2">{product.short_description}</p>
                          <p className="font-medium text-gray-900">
                            Precio: ${product.price}
                          </p>
                          <p>Categoría: {product.categories?.name || 'Desconocida'}</p>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.available ? 'Disponible' : 'No Disponible'}
                            </span>
                            {product.featured && (
                              <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                Destacado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : showSalesView ? (
              // Sales View
              <div>
                {/* Search Bar for Sales */}
                <div className="mb-6">
                  <SearchBar
                    value={saleSearchTerm}
                    onChange={setSaleSearchTerm}
                    onSearch={searchSales}
                    placeholder="Buscar ventas por nombre del cliente... (Presiona Enter)"
                  />
                </div>
                
                {loadingSales ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leather-600"></div>
                  </div>
                ) : sales.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {saleSearchTerm ? `No se encontraron ventas que coincidan con "${saleSearchTerm}"` : 'No hay ventas registradas. ¡Crea tu primera venta!'}
                  </p>
                ) : (
                  <div>
                    {/* Legend for status colors */}
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Leyenda de Estados:</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Pendiente</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>En Proceso</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Completado</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Cancelado</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {sales.map((sale) => (
                        <div key={sale.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          {/* Status indicator circle - Shows current workflow status */}
                          <div className={`w-4 h-4 rounded-full mt-2 flex-shrink-0 ${
                            sale.status === 'pendiente' ? 'bg-yellow-500' :
                            sale.status === 'en_proceso' ? 'bg-blue-500' :
                            sale.status === 'completado' ? 'bg-green-500' :
                            sale.status === 'cancelado' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}></div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-900">
                                {sale.customer_name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  ${sale.total_amount}
                                </span>
                                <select
                                  value={sale.status}
                                  onChange={(e) => updateSaleStatus(sale.id, e.target.value)}
                                  className="px-2 py-1 rounded text-xs font-medium border border-gray-300 focus:ring-1 focus:ring-leather-500 focus:border-leather-500"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="en_proceso">En Proceso</option>
                                  <option value="completado">Completado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Email: {sale.customer_email || 'No especificado'}</p>
                              <p>Teléfono: {sale.customer_phone || 'No especificado'}</p>
                              <p>Fecha: {new Date(sale.created_at).toLocaleDateString('es-ES')}</p>
                              <p>Estado: <span className="font-medium capitalize">{sale.status}</span></p>
                              {sale.notes && <p>Notas: {sale.notes}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Recent Activity View
              <div>
                {/* Search and Filter Bar for Activity */}
                <div className="mb-6 space-y-4">
                  {/* Search Bar */}
                  <SearchBar
                    value={activitySearchTerm}
                    onChange={setActivitySearchTerm}
                    onSearch={searchActivity}
                    placeholder="Buscar por nombre de recurso o email... (Presiona Enter)"
                  />
                  
                  {/* Action Type Filter Pills */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setActivityFilter('all')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activityFilter === 'all'
                          ? 'bg-leather-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setActivityFilter('CREATE')}
                                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          activityFilter === 'CREATE'
                            ? 'bg-leather-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => setActivityFilter('UPDATE')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activityFilter === 'UPDATE'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => setActivityFilter('DELETE')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activityFilter === 'DELETE'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {activitySearchTerm || activityFilter !== 'all' 
                      ? 'No se encontraron actividades que coincidan con los filtros' 
                      : 'No hay actividad reciente para mostrar'
                    }
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.action_type === 'CREATE' ? 'bg-green-500' :
                          activity.action_type === 'UPDATE' ? 'bg-blue-500' :
                          activity.action_type === 'DELETE' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {formatActionText(activity.action_type, activity.resource_type, activity.resource_name)}
                              </p>
                              <p className="text-xs text-gray-500">
                                by {activity.user_email} • {new Date(activity.created_at).toLocaleString()}
                              </p>
                              {activity.details && (
                                <div className="mt-1 text-xs text-gray-600">
                                  {formatActivityDetails(activity.details)}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => deleteActivityLog(activity.id)}
                              className="ml-2 text-red-500 hover:text-red-700 text-xs p-1 rounded hover:bg-red-50 transition-colors"
                              title="Eliminar log"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Crear Nuevo Producto</h3>
                <button
                  onClick={() => {
                    setShowProductForm(false)
                    // Refresh products if catalog is visible
                    if (showProductsCatalog) {
                      loadProducts()
                    }
                    // Refresh activity
                    loadRecentActivity()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ProductForm 
                onSuccess={() => {
                  setShowProductForm(false)
                  if (showProductsCatalog) {
                    loadProducts()
                  }
                  loadRecentActivity()
                }}
                logActivity={logActivity}
              />
            </div>
          </div>
        </div>
      )}

      {/* Product Edit Form Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Editar Producto: {editingProduct.title}</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ProductEditForm 
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onUpdate={() => {
                  loadProducts()
                  loadRecentActivity()
                }}
                logActivity={logActivity}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingProduct(null)
        }}
        onConfirm={confirmDeleteProduct}
        title="Eliminar Producto"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción eliminará permanentemente el producto y todas sus imágenes."
        itemName={deletingProduct?.title || ''}
        isLoading={false}
      />
    </div>
  )
}

export default AdminDashboardPage
