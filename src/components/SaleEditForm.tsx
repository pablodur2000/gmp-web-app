import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface SaleEditFormProps {
  sale: any // Sale with sales_items
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

interface SaleItem {
  id?: string // Existing item ID or undefined for new items
  productId: string
  productTitle?: string
  quantity: number
  unitPrice: number
  subtotal: number
}

const SaleEditForm = ({ sale, onClose, onUpdate, logActivity }: SaleEditFormProps) => {
  const [formData, setFormData] = useState({
    customerName: sale.customer_name || '',
    customerEmail: sale.customer_email || '',
    customerPhone: sale.customer_phone || '',
    notes: sale.notes || ''
  })
  const [items, setItems] = useState<SaleItem[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [newItemProductId, setNewItemProductId] = useState('')
  const [newItemQuantity, setNewItemQuantity] = useState(1)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    loadProducts()
    initializeItems()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, title, price')
      .eq('available', true)
      .order('title')
    setProducts(data || [])
  }

  const initializeItems = () => {
    if (sale.sales_items && sale.sales_items.length > 0) {
      const initialItems: SaleItem[] = sale.sales_items.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        productTitle: item.products?.title || '',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal
      }))
      setItems(initialItems)
    }
  }

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    const newItems = [...items]
    newItems[index].quantity = quantity
    newItems[index].subtotal = calculateSubtotal(quantity, newItems[index].unitPrice)
    setItems(newItems)
  }

  const updateItemPrice = (index: number, unitPrice: number) => {
    const newItems = [...items]
    newItems[index].unitPrice = unitPrice
    newItems[index].subtotal = calculateSubtotal(newItems[index].quantity, unitPrice)
    setItems(newItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const addNewItem = () => {
    if (!newItemProductId) {
      alert('Por favor selecciona un producto')
      return
    }

    const selectedProduct = products.find(p => p.id === newItemProductId)
    if (!selectedProduct) {
      alert('Producto no encontrado')
      return
    }

    const newItem: SaleItem = {
      productId: selectedProduct.id,
      productTitle: selectedProduct.title,
      quantity: newItemQuantity,
      unitPrice: selectedProduct.price,
      subtotal: calculateSubtotal(newItemQuantity, selectedProduct.price)
    }

    setItems([...items, newItem])
    setNewItemProductId('')
    setNewItemQuantity(1)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es requerido'
    }
    
    if (items.length === 0) {
      newErrors.items = 'Debe haber al menos un producto en la venta'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSaving(true)
    
    try {
      // Update sale with customer info
      const { error: saleError } = await supabase
        .from('sales')
        .update({
          customer_name: formData.customerName,
          customer_email: formData.customerEmail || null,
          customer_phone: formData.customerPhone || null,
          notes: formData.notes || null
        })
        .eq('id', sale.id)
      
      if (saleError) {
        console.error('Error updating sale:', saleError)
        alert('Error actualizando la venta: ' + saleError.message)
        return
      }

      // Get existing item IDs
      const existingItemIds = items.filter(item => item.id).map(item => item.id!)
      
      // Delete removed items
      if (sale.sales_items && sale.sales_items.length > 0) {
        const itemsToDelete = sale.sales_items
          .filter((item: any) => !existingItemIds.includes(item.id))
          .map((item: any) => item.id)
        
        if (itemsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('sales_items')
            .delete()
            .in('id', itemsToDelete)
          
          if (deleteError) {
            console.error('Error deleting sales items:', deleteError)
            // Continue anyway
          }
        }
      }

      // Update existing items and insert new ones
      for (const item of items) {
        if (item.id) {
          // Update existing item
          const { error: updateError } = await supabase
            .from('sales_items')
            .update({
              quantity: item.quantity,
              unit_price: item.unitPrice,
              subtotal: item.subtotal
            })
            .eq('id', item.id)
          
          if (updateError) {
            console.error('Error updating sales item:', updateError)
            // Continue anyway
          }
        } else {
          // Insert new item
          const { error: insertError } = await supabase
            .from('sales_items')
            .insert({
              sale_id: sale.id,
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              subtotal: item.subtotal
            })
          
          if (insertError) {
            console.error('Error inserting sales item:', insertError)
            // Continue anyway
          }
        }
      }

      // The database trigger will automatically update total_amount
      // But we can also update it manually to ensure consistency
      const calculatedTotal = calculateTotal()
      const { error: totalError } = await supabase
        .from('sales')
        .update({ total_amount: calculatedTotal })
        .eq('id', sale.id)
      
      if (totalError) {
        console.error('Error updating total:', totalError)
        // Continue anyway - trigger should handle it
      }

      // Log activity
      await logActivity({
        action_type: 'UPDATE',
        resource_type: 'SALE',
        resource_id: sale.id,
        resource_name: formData.customerName,
        details: {
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          total_amount: calculatedTotal,
          items_count: items.length,
          notes: formData.notes
        }
      })

      // Close form and refresh
      onUpdate()
      onClose()
      
    } catch (error) {
      console.error('Error updating sale:', error)
      alert('Error actualizando la venta: ' + error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Editar Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
            
            {errors.items && (
              <p className="text-red-500 text-xs mb-2">{errors.items}</p>
            )}

            {/* Existing Items */}
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Producto
                        </label>
                        <p className="text-sm text-gray-900">{item.productTitle || 'Producto no encontrado'}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Precio Unitario
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItemPrice(index, parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Subtotal
                        </label>
                        <p className="text-sm font-bold text-green-600">${item.subtotal}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="ml-3 text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Agregar Producto</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Producto
                  </label>
                  <select
                    value={newItemProductId}
                    onChange={(e) => setNewItemProductId(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Seleccionar producto</option>
                    {products.filter(p => !items.some(item => item.productId === p.id)).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.title} - ${product.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addNewItem}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-green-600">${calculateTotal()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaleEditForm
