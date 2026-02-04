
import { Category } from '../types'

interface InventoryStatusFilter {
  pieza_unica: boolean
  por_encargue_con_stock: boolean
  por_encargue_sin_stock: boolean
  sin_stock: boolean
  en_stock: boolean
}

interface PriceRangeFilter {
  lessThan50k: boolean
  between50k100k: boolean
  moreThan100k: boolean
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  inventoryFilters: InventoryStatusFilter
  onInventoryFilterChange: (filters: InventoryStatusFilter) => void
  priceRangeFilters: PriceRangeFilter
  onPriceRangeFilterChange: (filters: PriceRangeFilter) => void
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  inventoryFilters,
  onInventoryFilterChange,
  priceRangeFilters,
  onPriceRangeFilterChange
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
  const hasActivePriceFilters = Object.values(priceRangeFilters).some(filter => filter)

  const handlePriceRangeFilterChange = (range: keyof PriceRangeFilter) => {
    const newFilters = {
      ...priceRangeFilters,
      [range]: !priceRangeFilters[range]
    }
    onPriceRangeFilterChange(newFilters)
  }

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
          data-testid="catalog-subcategory-filter-all"
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
                    data-testid={`catalog-subcategory-filter-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                pieza_unica: false,
                por_encargue_con_stock: false,
                por_encargue_sin_stock: false,
                sin_stock: false,
                en_stock: false
              })}
              className="text-xs text-leather-600 hover:text-leather-800"
              data-testid="catalog-inventory-filter-clear"
            >
              Limpiar
            </button>
          )}
        </div>
                 <div className="space-y-2">
           <label className="flex items-center">
             <input 
               type="checkbox" 
               checked={inventoryFilters.pieza_unica}
               onChange={() => handleInventoryFilterChange('pieza_unica')}
               className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
               data-testid="catalog-inventory-filter-pieza-unica"
             />
             <span className="ml-2 text-sm text-gray-600">Pieza Única</span>
           </label>
           <label className="flex items-center">
             <input 
               type="checkbox" 
               checked={inventoryFilters.por_encargue_con_stock}
               onChange={() => handleInventoryFilterChange('por_encargue_con_stock')}
               className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
               data-testid="catalog-inventory-filter-encargo-mismo-material"
             />
             <span className="ml-2 text-sm text-gray-600">Encargo Mismo Material</span>
           </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={inventoryFilters.por_encargue_sin_stock}
              onChange={() => handleInventoryFilterChange('por_encargue_sin_stock')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-inventory-filter-encargo-diferente-material"
            />
            <span className="ml-2 text-sm text-gray-600">Encargo Diferente Material</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={inventoryFilters.sin_stock}
              onChange={() => handleInventoryFilterChange('sin_stock')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-inventory-filter-no-disponible"
            />
            <span className="ml-2 text-sm text-gray-600">No Disponible</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={inventoryFilters.en_stock}
              onChange={() => handleInventoryFilterChange('en_stock')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-inventory-filter-en-stock"
            />
            <span className="ml-2 text-sm text-gray-600">En Stock</span>
          </label>
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            Rango de Precio
          </h4>
          {hasActivePriceFilters && (
            <button
              onClick={() => onPriceRangeFilterChange({
                lessThan50k: false,
                between50k100k: false,
                moreThan100k: false
              })}
              className="text-xs text-leather-600 hover:text-leather-800"
              data-testid="catalog-price-filter-clear"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={priceRangeFilters.lessThan50k}
              onChange={() => handlePriceRangeFilterChange('lessThan50k')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-price-filter-less-than-50k"
            />
            <span className="ml-2 text-sm text-gray-600">Menos de $50.000</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={priceRangeFilters.between50k100k}
              onChange={() => handlePriceRangeFilterChange('between50k100k')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-price-filter-50k-100k"
            />
            <span className="ml-2 text-sm text-gray-600">$50.000 - $100.000</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={priceRangeFilters.moreThan100k}
              onChange={() => handlePriceRangeFilterChange('moreThan100k')}
              className="rounded border-gray-300 text-leather-600 focus:ring-leather-500"
              data-testid="catalog-price-filter-more-than-100k"
            />
            <span className="ml-2 text-sm text-gray-600">Más de $100.000</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter
