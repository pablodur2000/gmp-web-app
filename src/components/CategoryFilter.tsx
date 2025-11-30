
import { Category } from '../types'

interface InventoryStatusFilter {
  disponible_pieza_unica: boolean
  disponible_encargo_mismo_material: boolean
  disponible_encargo_diferente_material: boolean
  no_disponible: boolean
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  inventoryFilters: InventoryStatusFilter
  onInventoryFilterChange: (filters: InventoryStatusFilter) => void
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  inventoryFilters,
  onInventoryFilterChange
}: CategoryFilterProps) => {
  const totalProducts = categories.reduce((total, cat) => total + (cat.product_count || 0), 0)

  const handleInventoryFilterChange = (status: keyof InventoryStatusFilter) => {
    const newFilters = {
      ...inventoryFilters,
      [status]: !inventoryFilters[status]
    }
    onInventoryFilterChange(newFilters)
  }

  const hasActiveInventoryFilters = Object.values(inventoryFilters).some(filter => filter)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Categorías
      </h3>
      
      <div className="space-y-2">
        {/* All Categories Option */}
        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
            selectedCategory === 'all'
              ? 'bg-leather-100 text-leather-800 font-medium'
              : 'text-gray-600 hover:bg-leather-50 hover:text-leather-800'
          }`}
        >
          <span className="flex items-center justify-between">
            <span>Todas las categorías</span>
            <span className="text-sm text-gray-400">
              {totalProducts}
            </span>
          </span>
        </button>
        
        {/* Group categories by main category */}
        {(() => {
          // Group categories by main_category
          const groupedCategories = categories.reduce((groups, category) => {
            const mainCat = category.main_category || 'cuero'
            if (!groups[mainCat]) {
              groups[mainCat] = []
            }
            groups[mainCat].push(category)
            return groups
          }, {} as Record<string, Category[]>)

          // Get main category display names
          const mainCategoryNames: Record<string, string> = {
            'cuero': 'Artesanías en Cuero',
            'macrame': 'Macramé Artesanal'
          }

          return Object.entries(groupedCategories).map(([mainCat, subCategories]) => (
            <div key={mainCat} className="space-y-1">
              {/* Main Category Header */}
              <div className="px-3 py-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {mainCategoryNames[mainCat] || mainCat}
                </h4>
              </div>
              
              {/* Subcategories */}
              {subCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.name)}
                    className={`w-full text-left px-6 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-leather-100 text-leather-800 font-medium'
                        : 'text-gray-600 hover:bg-leather-50 hover:text-leather-800'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-400">
                        {category.product_count || 0}
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          ))
        })()}
      </div>
      
      {/* Inventory Status Filter */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            Estado de Inventario
          </h4>
          {hasActiveInventoryFilters && (
            <button
              onClick={() => onInventoryFilterChange({
                disponible_pieza_unica: false,
                disponible_encargo_mismo_material: false,
                disponible_encargo_diferente_material: false,
                no_disponible: false
              })}
              className="text-xs text-leather-600 hover:text-leather-800"
            >
              Limpiar
            </button>
          )}
        </div>
                 <div className="space-y-2">
           <label className="flex items-center">
             <input 
               type="checkbox" 
               checked={inventoryFilters.disponible_pieza_unica}
               onChange={() => handleInventoryFilterChange('disponible_pieza_unica')}
               className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" 
             />
             <span className="ml-2 text-sm text-gray-600">Pieza Única</span>
           </label>
           <label className="flex items-center">
             <input 
               type="checkbox" 
               checked={inventoryFilters.disponible_encargo_mismo_material}
               onChange={() => handleInventoryFilterChange('disponible_encargo_mismo_material')}
               className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" 
             />
             <span className="ml-2 text-sm text-gray-600">Encargo Mismo Material</span>
           </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={inventoryFilters.disponible_encargo_diferente_material}
              onChange={() => handleInventoryFilterChange('disponible_encargo_diferente_material')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" 
            />
            <span className="ml-2 text-sm text-gray-600">Encargo Diferente Material</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={inventoryFilters.no_disponible}
              onChange={() => handleInventoryFilterChange('no_disponible')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" 
            />
            <span className="ml-2 text-sm text-gray-600">No Disponible</span>
          </label>
        </div>
      </div>
      
      {/* Price Range Filter (Future Enhancement) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Rango de Precio
        </h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" />
            <span className="ml-2 text-sm text-gray-600">Menos de $50.000</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" />
            <span className="ml-2 text-sm text-gray-600">$50.000 - $100.000</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-leather-600 focus:ring-leather-500" />
            <span className="ml-2 text-sm text-gray-600">Más de $100.000</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter
