import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Clock } from 'lucide-react'
import { Product } from '../types'
import { supabase } from '../lib/supabase'
import { getInventoryStatusInfo } from '../utils/inventoryStatus'

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      
      // Get featured products with category information, limit to 3
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            description
          )
        `)
        .eq('featured', true)
        .eq('available', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error loading featured products:', error)
        return
      }

      setFeaturedProducts(data || [])
    } catch (error) {
      console.error('Error loading featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nuestras piezas más populares y solicitadas, creadas con los mejores materiales
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leather-600"></div>
          </div>
        </div>
      </section>
    )
  }

  // If no featured products, don't show the section
  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestras piezas más populares y solicitadas, creadas con los mejores materiales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => {
            const statusInfo = getInventoryStatusInfo(product.inventory_status)
            const isPorEncargueSinStock = product.inventory_status === 'disponible_encargo_diferente_material'
            
            return (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Destacado</span>
                  </div>
                  
                  {/* 10% OFF Pill for First Product */}
                  {featuredProducts.indexOf(product) === 0 && (
                    <div className="absolute top-16 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform rotate-3">
                      10% OFF
                    </div>
                  )}
                  
                  {/* Price Tag - Always at top-right */}
                  <div className="absolute top-4 right-4 bg-white bg-opacity-95 text-leather-800 font-bold px-3 py-2 rounded-lg shadow-md">
                    {formatPrice(product.price)}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-leather-600 transition-colors duration-200">
                    {product.title}
                  </h3>
                  
                  {/* Full Description (shorter version) */}
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </p>
                  
                  {/* Inventory Status Badge */}
                  <div className="mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  
                  {/* Special Message for Por Encargue Sin Stock */}
                  {isPorEncargueSinStock && (
                    <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 text-orange-700">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">
                          Puede demorar de 1 a 2 semanas, dependiendo la complejidad
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Link
                    to={`/producto/${product.id}`}
                    className="inline-flex items-center space-x-2 text-leather-600 hover:text-leather-800 font-medium transition-colors duration-200"
                  >
                    <span>Ver Detalles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/catalogo"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
