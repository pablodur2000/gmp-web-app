import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Instagram, MessageCircle } from 'lucide-react'
import { Product } from '../types'
import { supabase } from '../lib/supabase'
import { getInventoryStatusInfo } from '../utils/inventoryStatus'
import ProductCard from '../components/ProductCard'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingRelated, setLoadingRelated] = useState(false)

  // Load product from database
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name,
              description,
              main_category
            )
          `)
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error loading product:', error)
          setProduct(null)
          return
        }

        if (data) {
          setProduct(data as Product)
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Error loading product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  // Load related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return

      try {
        setLoadingRelated(true)
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq('category_id', product.category_id)
          .eq('available', true)
          .neq('id', product.id)
          .neq('inventory_status', 'sin_stock')
          .limit(4)

        if (error) {
          console.error('Error loading related products:', error)
          return
        }

        setRelatedProducts(data || [])
      } catch (error) {
        console.error('Error loading related products:', error)
      } finally {
        setLoadingRelated(false)
      }
    }

    loadRelatedProducts()
  }, [product])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leather-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link to="/catalogo" className="btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-leather-600">Inicio</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-leather-600">Catálogo</Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <>
                <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg mb-4">
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500?text=Imagen+no+disponible'
                    }}
                  />
                </div>
                
                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                          selectedImage === index 
                            ? 'border-leather-600' 
                            : 'border-gray-200 hover:border-leather-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Error'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Back Button */}
            <Link
              to="/catalogo"
              className="inline-flex items-center space-x-2 text-leather-600 hover:text-leather-800 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </Link>

            {/* Title and Badges */}
            <div className="mb-4">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-center space-x-3">
                {product.featured && (
                  <span className="bg-primary-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Destacado
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.available ? 'Disponible' : 'Agotado'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-leather-800">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Inventory Status */}
            {product.inventory_status && (() => {
              const statusInfo = getInventoryStatusInfo(product.inventory_status)
              return (
                <div className="mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  {statusInfo.message && (
                    <p className="text-sm text-gray-600 mt-2">{statusInfo.message}</p>
                  )}
                </div>
              )
            })()}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leather-600 rounded-full"></div>
                  <span>Cuero genuino de primera calidad</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leather-600 rounded-full"></div>
                  <span>Hecho completamente a mano</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leather-600 rounded-full"></div>
                  <span>Diseño único y elegante</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-leather-600 rounded-full"></div>
                  <span>Durabilidad garantizada</span>
                </li>
              </ul>
            </div>

            {/* Contact Actions */}
            <div className="space-y-4 mb-8">
              <a
                href="https://www.instagram.com/gmp.artesanias/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Instagram className="w-5 h-5" />
                <span>Ver en Instagram</span>
              </a>
              
              <div className="flex space-x-3">
                <a
                  href="https://www.instagram.com/gmp.artesanias/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Mensaje Instagram</span>
                </a>
                <a
                  href="https://wa.me/59898702414"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-leather-800 mb-8">
            Productos Relacionados
          </h2>
          {loadingRelated ? (
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hay productos relacionados disponibles en esta categoría.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
