import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Grid, List } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import { Product, Category } from '../types'
import { supabase } from '../lib/supabase'

interface InventoryStatusFilter {
  pieza_unica: boolean
  por_encargue_con_stock: boolean
  por_encargue_sin_stock: boolean
  sin_stock: boolean
  en_stock: boolean
}

/** Map UI filter keys to DB inventory_status values (PROD schema) */
const INVENTORY_FILTER_TO_DB: Record<keyof InventoryStatusFilter, string> = {
  pieza_unica: 'disponible_pieza_unica',
  por_encargue_con_stock: 'disponible_encargo_mismo_material',
  por_encargue_sin_stock: 'disponible_encargo_diferente_material',
  sin_stock: 'no_disponible',
  en_stock: 'disponible_pieza_unica'
}

interface PriceRangeFilter {
  lessThan50k: boolean
  between50k100k: boolean
  moreThan100k: boolean
}

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [inventoryFilters, setInventoryFilters] = useState<InventoryStatusFilter>({
    pieza_unica: false,
    por_encargue_con_stock: false,
    por_encargue_sin_stock: false,
    sin_stock: false,
    en_stock: false
  })
  const [priceRangeFilters, setPriceRangeFilters] = useState<PriceRangeFilter>({
    lessThan50k: false,
    between50k100k: false,
    moreThan100k: false
  })

  // Load categories with product counts
  useEffect(() => {
    loadCategories()
  }, [])

  // Read category from URL on mount
  useEffect(() => {
    const categoriaParam = searchParams.get('categoria')
    if (categoriaParam) {
      setSelectedCategory(categoriaParam)
    }
  }, [searchParams])

  // Load products when category, main category, inventory filters, or price filters change
  useEffect(() => {
    loadProducts()
  }, [selectedCategory, selectedMainCategory, inventoryFilters, priceRangeFilters])

  const loadCategories = async () => {
    try {
      console.log('Loading categories...')
      // Get categories with product counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError)
        return
      }

      console.log('Raw categories data:', categoriesData)

      // Get product counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('available', true)
            .neq('inventory_status', 'no_disponible')

          if (countError) {
            console.error('Error counting products for category:', countError)
            return { ...category, product_count: 0 }
          }

          return { ...category, product_count: count || 0 }
        })
      )

      console.log('Categories with counts:', categoriesWithCounts)
      setCategories(categoriesWithCounts)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setIsFiltering(true)
      console.log('Loading products for category:', selectedCategory)
      console.log('Inventory filters:', inventoryFilters)
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            description
          )
        `)
        .eq('available', true)
        .neq('inventory_status', 'no_disponible') // Hide no_disponible from public catalog
        .order('created_at', { ascending: false })

      // Filter by main category if selected
      if (selectedMainCategory !== 'all') {
        console.log('Filtering by main category:', selectedMainCategory)
        query = query.eq('main_category', selectedMainCategory)
      }

      // Filter by category if selected
      if (selectedCategory !== 'all') {
        console.log('Filtering by category:', selectedCategory)
        
        // First, get the category ID for the selected category name
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', selectedCategory)
          .single()
        
        if (categoryError) {
          console.error('Error getting category ID:', categoryError)
          return
        }
        
        if (categoryData) {
          console.log('Found category ID:', categoryData.id)
          // Filter by category_id instead of trying to filter on joined table
          query = query.eq('category_id', categoryData.id)
        }
      }

      // Filter by inventory status if any filters are active (map UI keys to DB values)
      const activeInventoryFilters = Object.entries(inventoryFilters)
        .filter(([_, isActive]) => isActive)
        .map(([status]) => INVENTORY_FILTER_TO_DB[status as keyof InventoryStatusFilter])

      if (activeInventoryFilters.length > 0) {
        console.log('Filtering by inventory status:', activeInventoryFilters)
        query = query.in('inventory_status', activeInventoryFilters)
      }

      console.log('Final query:', query)
      const { data, error } = await query

      if (error) {
        console.error('Error loading products:', error)
        return
      }

      // Filter by price range in memory (allows multiple ranges with OR logic)
      let filteredData = data
      const activePriceFilters = Object.entries(priceRangeFilters)
        .filter(([_, isActive]) => isActive)
        .map(([range, _]) => range)

      if (activePriceFilters.length > 0) {
        console.log('Filtering by price range:', activePriceFilters)
        filteredData = data?.filter(product => {
          if (priceRangeFilters.lessThan50k && product.price < 50000) return true
          if (priceRangeFilters.between50k100k && product.price >= 50000 && product.price <= 100000) return true
          if (priceRangeFilters.moreThan100k && product.price > 100000) return true
          return false
        })
      }

      console.log('Products loaded:', filteredData?.length || 0)
      console.log('Products data:', filteredData)
      
      // Log each product's category information
      if (filteredData) {
        filteredData.forEach((product, index) => {
          console.log(`Product ${index + 1}:`, {
            title: product.title,
            category_id: product.category_id,
            category_name: product.categories?.name,
            category_description: product.categories?.description
          })
        })
      }

      setProducts(filteredData || [])
      
      // Small delay to allow smooth animation
      setTimeout(() => {
        setIsFiltering(false)
      }, 100)
    } catch (error) {
      console.error('Error loading products:', error)
      setIsFiltering(false)
    } finally {
      setLoading(false)
    }
  }

  // API search function
  const handleSearch = async (searchValue: string) => {
    if (!searchValue.trim()) {
      loadProducts()
      return
    }

    try {
      setSearchLoading(true)
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            description
          )
        `)
        .eq('available', true)
        .neq('inventory_status', 'no_disponible') // Hide no_disponible from public catalog
        .or(`title.ilike.%${searchValue}%,description.ilike.%${searchValue}%`)
        .order('created_at', { ascending: false })

      // Filter by category if selected
      if (selectedCategory !== 'all') {
        // First, get the category ID for the selected category name
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', selectedCategory)
          .single()
        
        if (categoryError) {
          console.error('Error getting category ID for search:', categoryError)
          return
        }
        
        if (categoryData) {
          console.log('Found category ID for search:', categoryData.id)
          // Filter by category_id instead of trying to filter on joined table
          query = query.eq('category_id', categoryData.id)
        }
      }

      // Filter by inventory status if any filters are active (map UI keys to DB values)
      const activeInventoryFilters = Object.entries(inventoryFilters)
        .filter(([_, isActive]) => isActive)
        .map(([status]) => INVENTORY_FILTER_TO_DB[status as keyof InventoryStatusFilter])

      if (activeInventoryFilters.length > 0) {
        console.log('Filtering by inventory status:', activeInventoryFilters)
        query = query.in('inventory_status', activeInventoryFilters)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error searching products:', error)
        return
      }

      // Filter by price range in memory (allows multiple ranges with OR logic)
      let filteredData = data
      const activePriceFilters = Object.entries(priceRangeFilters)
        .filter(([_, isActive]) => isActive)
        .map(([range, _]) => range)

      if (activePriceFilters.length > 0) {
        console.log('Filtering by price range in search:', activePriceFilters)
        filteredData = data?.filter(product => {
          if (priceRangeFilters.lessThan50k && product.price < 50000) return true
          if (priceRangeFilters.between50k100k && product.price >= 50000 && product.price <= 100000) return true
          if (priceRangeFilters.moreThan100k && product.price > 100000) return true
          return false
        })
      }

      setProducts(filteredData || [])
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Clear timeout if exists
    if ((window as any).searchTimeout) {
      clearTimeout((window as any).searchTimeout)
    }
    
    // Set new timeout for search
    (window as any).searchTimeout = setTimeout(() => {
      handleSearch(value)
    }, 500)
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    console.log('Category changed to:', category)
    setIsFiltering(true)
    setSelectedCategory(category)
    setSearchTerm('') // Clear search when category changes
    
    // Update URL parameter
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ categoria: category })
    }
  }

  // Handle inventory filter change
  const handleInventoryFilterChange = (filters: InventoryStatusFilter) => {
    setIsFiltering(true)
    setInventoryFilters(filters)
    setSearchTerm('') // Clear search when filters change
  }

  const handlePriceRangeFilterChange = (filters: PriceRangeFilter) => {
    setIsFiltering(true)
    setPriceRangeFilters(filters)
    setSearchTerm('') // Clear search when filters change
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leather-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="catalog-page">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 
            className="text-3xl font-serif font-bold text-leather-800 mb-2"
            data-testid="catalog-heading"
          >
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra colección de artesanías en cuero hechas a mano
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              inventoryFilters={inventoryFilters}
              onInventoryFilterChange={handleInventoryFilterChange}
              priceRangeFilters={priceRangeFilters}
              onPriceRangeFilterChange={handlePriceRangeFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Main Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tipo de Artesanía</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedMainCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedMainCategory === 'all'
                      ? 'bg-leather-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  data-testid="catalog-main-category-all"
                >
                  Todas
                </button>
                <button
                  onClick={() => setSelectedMainCategory('cuero')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedMainCategory === 'cuero'
                      ? 'bg-leather-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  data-testid="catalog-main-category-cuero"
                >
                  Cuero
                </button>
                <button
                  onClick={() => setSelectedMainCategory('macrame')}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedMainCategory === 'macrame'
                      ? 'bg-leather-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  data-testid="catalog-main-category-macrame"
                >
                  Macramé
                </button>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input-field pl-10"
                  data-testid="catalog-search-input"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-leather-600"></div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-leather-100 text-leather-800' 
                      : 'text-gray-400 hover:text-leather-800'
                  }`}
                  data-testid="catalog-view-toggle-grid"
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-leather-100 text-leather-800' 
                      : 'text-gray-400 hover:text-leather-800'
                  }`}
                  data-testid="catalog-view-toggle-list"
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600" data-testid="catalog-product-count">
                Mostrando {products.length} productos
                {selectedMainCategory !== 'all' && (
                  <>
                    <span> de </span>
                    <span className="font-medium text-leather-800">
                      {selectedMainCategory === 'cuero' ? 'Cuero' : 'Macramé'}
                    </span>
                  </>
                )}
                {selectedCategory !== 'all' && (
                  <>
                    <span> en </span>
                    <span className="font-medium text-leather-800">{selectedCategory}</span>
                  </>
                )}
                {searchTerm && ` para "${searchTerm}"`}
                {Object.values(inventoryFilters).some(f => f) && (
                  <span className="ml-2 text-leather-600">
                    • Filtros de inventario activos
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div 
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                data-testid="catalog-product-list"
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="transition-all duration-300 ease-out"
                    style={{
                      animation: `fadeInScale 0.3s ease-out forwards`,
                      animationDelay: `${index * 0.03}s`,
                      opacity: isFiltering ? 0 : 1
                    }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-testid="catalog-empty-state">
                <div className="w-24 h-24 bg-leather-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-leather-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : Object.values(inventoryFilters).some(f => f)
                    ? 'No hay productos disponibles con los filtros de inventario seleccionados'
                    : 'No hay productos disponibles en esta categoría'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogPage
