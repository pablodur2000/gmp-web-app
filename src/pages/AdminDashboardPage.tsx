import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogOut, Plus, Edit, Package, X, CheckCircle, ShoppingBag, List, DollarSign, Eye, EyeOff, Sparkles, Save, Trash2, Bell, Mail } from 'lucide-react'
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
  const [showMessagesModal, setShowMessagesModal] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [manuallyUnreadMessages, setManuallyUnreadMessages] = useState<Set<string>>(new Set())
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
  const [deletingSale, setDeletingSale] = useState<any>(null)
  const [showDeleteSaleModal, setShowDeleteSaleModal] = useState(false)
  const [quickSaleForm, setQuickSaleForm] = useState({
    productId: '',
    quantity: 1,
    customerName: '',
    customerPhone: '',
    notes: ''
  })
  const [addingSale, setAddingSale] = useState(false)



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

  // Load messages when messages modal is shown
  useEffect(() => {
    if (showMessagesModal) {
      loadMessages()
    }
  }, [showMessagesModal])

  // Load unread count periodically
  useEffect(() => {
    if (user) {
      loadUnreadCount()
      const interval = setInterval(() => {
        loadUnreadCount()
      }, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [user])

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

  const loadMessages = async () => {
    try {
      setLoadingMessages(true)
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false)

      if (error) {
        console.error('Error loading unread count:', error)
        return
      }

      setUnreadCount(count || 0)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  const toggleMessageRead = async (messageId: string, currentRead: boolean) => {
    try {
      const newReadStatus = !currentRead
      
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: newReadStatus })
        .eq('id', messageId)

      if (error) {
        console.error('Error updating message read status:', error)
        return
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: newReadStatus } : msg
      ))
      
      // Track manually unread messages (if user marks as unread)
      if (!newReadStatus) {
        setManuallyUnreadMessages(prev => new Set(prev).add(messageId))
      } else {
        setManuallyUnreadMessages(prev => {
          const newSet = new Set(prev)
          newSet.delete(messageId)
          return newSet
        })
      }
      
      // Update unread count
      loadUnreadCount()
    } catch (error) {
      console.error('Error toggling message read status:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        console.error('Error deleting message:', error)
        alert('Error al eliminar el mensaje')
        return
      }

      // Remove from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId))
      
      // If selected message was deleted, clear selection
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null)
      }
      
      // Update unread count
      loadUnreadCount()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Error al eliminar el mensaje')
    }
  }

  const markAllAsRead = async () => {
    try {
      // Mark all currently unread messages as read, EXCEPT manually unread ones
      const unreadMessages = messages.filter(msg => 
        !msg.read && !manuallyUnreadMessages.has(msg.id)
      )
      
      if (unreadMessages.length === 0) return

      const messageIds = unreadMessages.map(msg => msg.id)
      
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .in('id', messageIds)

      if (error) {
        console.error('Error marking messages as read:', error)
        return
      }

      // Update local state
      setMessages(prev => prev.map(msg => 
        unreadMessages.some(um => um.id === msg.id) ? { ...msg, read: true } : msg
      ))
      
      // Update unread count
      loadUnreadCount()
    } catch (error) {
      console.error('Error marking all as read:', error)
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

  const createQuickSale = async () => {
    if (!quickSaleForm.productId || !quickSaleForm.customerName) {
      alert('Por favor completa el producto y el nombre del cliente')
      return
    }

    setAddingSale(true)
    try {
      // Get product details
      const selectedProduct = products.find(p => p.id === quickSaleForm.productId)
      if (!selectedProduct) {
        alert('Producto no encontrado')
        return
      }

      const subtotal = selectedProduct.price * quickSaleForm.quantity

      // Create sale
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          customer_name: quickSaleForm.customerName,
          customer_phone: quickSaleForm.customerPhone || null,
          total_amount: subtotal,
          status: 'pendiente',
          notes: quickSaleForm.notes,
          sold: false
        }])
        .select()
        .single()

      if (saleError) {
        console.error('Error creating sale:', saleError)
        alert('Error creando la venta: ' + saleError.message)
        return
      }

      // Create sales_item entry (links product to sale)
      const { error: itemError } = await supabase
        .from('sales_items')
        .insert([{
          sale_id: saleData.id,
          product_id: selectedProduct.id,
          quantity: quickSaleForm.quantity,
          unit_price: selectedProduct.price,
          subtotal: subtotal
        }])

      if (itemError) {
        console.error('Error creating sale item:', itemError)
        // Don't fail the whole operation, but log it
        console.warn('Sale created but sales_item failed. Sale ID:', saleData.id)
      }

      // Log activity
      await logActivity({
        action_type: 'CREATE',
        resource_type: 'SALE',
        resource_id: saleData.id,
        resource_name: quickSaleForm.customerName,
        details: {
          product: selectedProduct.title,
          quantity: quickSaleForm.quantity,
          total_amount: subtotal,
          notes: quickSaleForm.notes
        }
      })

      // Reset form
      setQuickSaleForm({
        productId: '',
        quantity: 1,
        customerName: '',
        customerPhone: '',
        notes: ''
      })

      // Refresh sales
      loadSales()

      // Show success
      setShowDeleteSuccess(true)
      setTimeout(() => setShowDeleteSuccess(false), 2000)

    } catch (error: any) {
      console.error('Error creating quick sale:', error)
      alert('Error creando la venta: ' + error.message)
    } finally {
      setAddingSale(false)
    }
  }

  const handleDeleteSale = (sale: any) => {
    setDeletingSale(sale)
    setShowDeleteSaleModal(true)
  }

  const confirmDeleteSale = async () => {
    if (!deletingSale) return
    
    try {
      console.log('🗑️ Starting sale deletion...', deletingSale)
      
      // Delete sale from database (sales_items will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', deletingSale.id)
      
      if (error) {
        console.error('❌ Error deleting sale:', error)
        alert('Error deleting sale: ' + error.message)
        return
      }
      
      console.log('✅ Sale deleted from database successfully')
      
      // Log activity
      console.log('📝 Logging delete activity...')
      await logActivity({
        action_type: 'DELETE',
        resource_type: 'SALE',
        resource_id: deletingSale.id,
        resource_name: deletingSale.customer_name,
        details: {
          customer_name: deletingSale.customer_name,
          total_amount: deletingSale.total_amount,
          status: deletingSale.status
        }
      })
      
      console.log('✅ Activity logged successfully')
      
      // Refresh sales
      loadSales()
      
      // Show success message
      setShowDeleteSuccess(true)
      setTimeout(() => setShowDeleteSuccess(false), 1000)
      
      // Close modal
      setShowDeleteSaleModal(false)
      setDeletingSale(null)
      
    } catch (error) {
      console.error('❌ Error deleting sale:', error)
      alert('Error deleting sale: ' + error)
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
            <div className="flex items-center space-x-4">
              {/* Messages Notification */}
              <button
                onClick={() => {
                  setManuallyUnreadMessages(new Set()) // Reset on open
                  setShowMessagesModal(true)
                  loadMessages()
                }}
                className="relative flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline">Mensajes</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
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
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-leather-50 to-white">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-leather-600" />
              <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Gestiona tu tienda de forma eficiente</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Add Product Card */}
              <button 
                onClick={() => setShowProductForm(true)}
                className="group relative overflow-hidden bg-gradient-to-br from-leather-50 to-leather-100 border-2 border-leather-200 rounded-xl p-6 hover:border-leather-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-4 bg-leather-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Agregar Producto</h3>
                    <p className="text-sm text-gray-600 mt-1">Crea un nuevo producto</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-leather-400 rounded-full animate-pulse"></div>
                </div>
              </button>

              {/* Manage Products Card */}
              <button 
                onClick={() => {
                  setShowProductsCatalog(!showProductsCatalog)
                  if (!showProductsCatalog) {
                    setShowSalesView(false) // Deselect sales when selecting products
                  }
                }}
                className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  showProductsCatalog 
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    showProductsCatalog ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    {showProductsCatalog ? (
                      <EyeOff className="w-6 h-6 text-white" />
                    ) : (
                      <List className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {showProductsCatalog ? 'Ocultar Productos' : 'Gestionar Productos'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {showProductsCatalog ? 'Cerrar catálogo' : 'Ver y editar productos'}
                    </p>
                  </div>
                </div>
                {showProductsCatalog && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>

              {/* View Sales Card */}
              <button 
                onClick={() => {
                  setShowSalesView(!showSalesView)
                  if (!showSalesView) {
                    setShowProductsCatalog(false) // Deselect products when selecting sales
                  }
                }}
                className={`group relative overflow-hidden rounded-xl p-6 border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  showSalesView 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-green-300 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    showSalesView ? 'bg-green-600' : 'bg-gray-400'
                  }`}>
                    {showSalesView ? (
                      <EyeOff className="w-6 h-6 text-white" />
                    ) : (
                      <DollarSign className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {showSalesView ? 'Ocultar Ventas' : 'Ver Ventas'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {showSalesView ? 'Cerrar vista de ventas' : 'Gestionar pedidos y ventas'}
                    </p>
                  </div>
                </div>
                {showSalesView && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
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
              <div className="space-y-6">
                {/* Quick Sale Form */}
                <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Venta Rápida</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Product Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Producto *
                      </label>
                      <select
                        value={quickSaleForm.productId}
                        onChange={(e) => setQuickSaleForm({...quickSaleForm, productId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {products.filter(p => p.available).map(product => (
                          <option key={product.id} value={product.id}>
                            {product.title} - ${product.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={quickSaleForm.quantity}
                        onChange={(e) => setQuickSaleForm({...quickSaleForm, quantity: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cliente *
                      </label>
                      <input
                        type="text"
                        value={quickSaleForm.customerName}
                        onChange={(e) => setQuickSaleForm({...quickSaleForm, customerName: e.target.value})}
                        placeholder="Nombre del cliente"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>

                    {/* Customer Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={quickSaleForm.customerPhone}
                        onChange={(e) => setQuickSaleForm({...quickSaleForm, customerPhone: e.target.value})}
                        placeholder="+598 123 456 789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas
                      </label>
                      <input
                        type="text"
                        value={quickSaleForm.notes}
                        onChange={(e) => setQuickSaleForm({...quickSaleForm, notes: e.target.value})}
                        placeholder="Notas adicionales"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  {/* Total Preview and Add Button */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-green-200">
                    <div className="flex items-center space-x-4">
                      {quickSaleForm.productId && (
                        <div className="text-sm">
                          <span className="text-gray-600">Total: </span>
                          <span className="font-bold text-green-600 text-lg">
                            ${(products.find(p => p.id === quickSaleForm.productId)?.price || 0) * quickSaleForm.quantity}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={createQuickSale}
                      disabled={addingSale || !quickSaleForm.productId || !quickSaleForm.customerName}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {addingSale ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Agregando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Agregar Venta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Search Bar for Sales */}
                <div>
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
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      {saleSearchTerm ? `No se encontraron ventas que coincidan con "${saleSearchTerm}"` : 'No hay ventas registradas'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {!saleSearchTerm && 'Usa el formulario de arriba para crear tu primera venta'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Legend for status colors */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-3">Leyenda de Estados:</p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium">Pendiente</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">En Proceso</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Completado</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Cancelado</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sales List */}
                    <div className="space-y-3">
                      {sales.map((sale) => (
                        <div key={sale.id} className="bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 transition-colors duration-200 overflow-hidden">
                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              {/* Left: Customer Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                                    sale.status === 'pendiente' ? 'bg-yellow-500' :
                                    sale.status === 'en_proceso' ? 'bg-blue-500' :
                                    sale.status === 'completado' ? 'bg-green-500' :
                                    sale.status === 'cancelado' ? 'bg-red-500' :
                                    'bg-gray-500'
                                  }`}></div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {sale.customer_name}
                                  </h3>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    sale.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                    sale.status === 'en_proceso' ? 'bg-blue-100 text-blue-800' :
                                    sale.status === 'completado' ? 'bg-green-100 text-green-800' :
                                    sale.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium text-gray-700">Email:</span>
                                    <p className="mt-1">{sale.customer_email || 'No especificado'}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Teléfono:</span>
                                    <p className="mt-1">{sale.customer_phone || 'No especificado'}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Fecha:</span>
                                    <p className="mt-1">{new Date(sale.created_at).toLocaleDateString('es-ES')}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Total:</span>
                                    <p className="mt-1 font-bold text-green-600">${sale.total_amount}</p>
                                  </div>
                                </div>
                                
                                {sale.notes && (
                                  <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                                    <span className="text-xs font-medium text-gray-700">Notas: </span>
                                    <span className="text-sm text-gray-600">{sale.notes}</span>
                                  </div>
                                )}
                              </div>

                              {/* Right: Actions */}
                              <div className="ml-4 flex flex-col items-end space-y-2">
                                <select
                                  value={sale.status}
                                  onChange={(e) => updateSaleStatus(sale.id, e.target.value)}
                                  className="px-3 py-1.5 rounded-lg text-sm font-medium border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="en_proceso">En Proceso</option>
                                  <option value="completado">Completado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteSale(sale)}
                                  className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                  title="Eliminar venta"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Eliminar</span>
                                </button>
                              </div>
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

      {/* Delete Product Confirmation Modal */}
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

      {/* Messages Modal - 70% screen */}
      {showMessagesModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              markAllAsRead()
              setShowMessagesModal(false)
              setSelectedMessage(null)
              setManuallyUnreadMessages(new Set()) // Reset on close
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-[70%] max-w-4xl h-[70vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Mensajes de Contacto</h2>
              <button
                onClick={() => {
                  markAllAsRead()
                  setShowMessagesModal(false)
                  setSelectedMessage(null)
                  setManuallyUnreadMessages(new Set()) // Reset on close
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leather-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No hay mensajes de contacto</p>
                </div>
              ) : selectedMessage ? (
                // Message Detail View
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-leather-600 hover:text-leather-800 text-sm font-medium mb-4"
                  >
                    ← Volver a la lista
                  </button>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <p className="mt-1 text-gray-900">{selectedMessage.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{selectedMessage.email}</p>
                    </div>
                    
                    {selectedMessage.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-gray-900">{selectedMessage.phone}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mensaje</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedMessage.created_at).toLocaleString('es-ES')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <button
                        onClick={() => {
                          toggleMessageRead(selectedMessage.id, selectedMessage.read)
                          setSelectedMessage({ ...selectedMessage, read: !selectedMessage.read })
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedMessage.read
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        {selectedMessage.read ? 'Marcar como no leído' : 'Marcar como leído'}
                      </button>
                      <button
                        onClick={() => {
                          deleteMessage(selectedMessage.id)
                          setSelectedMessage(null)
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-600 hover:bg-red-200 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Messages List View
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`bg-white rounded-lg border-2 transition-colors duration-200 overflow-hidden cursor-pointer ${
                        !message.read
                          ? 'border-blue-300 bg-blue-50 hover:border-blue-400'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {!message.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <h3 className="font-semibold text-gray-900">{message.name}</h3>
                              <span className="text-sm text-gray-500">{message.email}</span>
                              {message.phone && (
                                <span className="text-sm text-gray-500">• {message.phone}</span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                              {message.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleString('es-ES')}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleMessageRead(message.id, message.read)
                              }}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                message.read
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                              }`}
                            >
                              {message.read ? 'No leído' : 'Leído'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteMessage(message.id)
                              }}
                              className="px-3 py-1 rounded text-xs font-medium transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                              title="Eliminar mensaje"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Delete Sale Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteSaleModal}
        onClose={() => {
          setShowDeleteSaleModal(false)
          setDeletingSale(null)
        }}
        onConfirm={confirmDeleteSale}
        title="Eliminar Venta"
        message="¿Estás seguro de que quieres eliminar esta venta? Esta acción eliminará permanentemente la venta y todos sus productos asociados."
        itemName={deletingSale?.customer_name || ''}
        isLoading={false}
      />
    </div>
  )
}

export default AdminDashboardPage
