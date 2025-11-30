import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingCart, Share2, Truck, Shield, RefreshCw } from 'lucide-react'
import { Product } from '../types'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock product data - replace with Supabase query
    const mockProduct: Product = {
      id: id || '1',
      title: 'Billetera de Cuero Premium',
      description: 'Billetera elegante hecha a mano con cuero genuino de primera calidad. Esta pieza única combina funcionalidad y estilo, con múltiples compartimentos para organizar tarjetas, billetes y monedas. El cuero premium garantiza durabilidad y un envejecimiento elegante con el tiempo.',
      short_description: 'Billetera elegante de cuero genuino',
      price: 45000,
      category_id: 'billeteras',
      main_category: 'cuero',
      available: true,
      inventory_status: 'disponible_pieza_unica',
      images: [
        'https://f.fcdn.app/imgs/640e47/tienda.soysantander.com.uy/comp/6131/original/catalogo/BIGAIONAL_NAC41161005_1/1500-1500/billetera-de-cuero-garnie-nacional-oficial-negro.jpg',
        'https://f.fcdn.app/imgs/640e47/tienda.soysantander.com.uy/comp/6131/original/catalogo/BIGAIONAL_NAC41161005_1/1500-1500/billetera-de-cuero-garnie-nacional-oficial-negro.jpg',
        'https://f.fcdn.app/imgs/640e47/tienda.soysantander.com/uy/comp/6131/original/catalogo/BIGAIONAL_NAC41161005_1/1500-1500/billetera-de-cuero-garnie-nacional-oficial-negro.jpg'
      ],
      featured: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }
    
    setProduct(mockProduct)
    setLoading(false)
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
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
            <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-lg mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
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
                  />
                </button>
              ))}
            </div>
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
            <div className="mb-6">
              <span className="text-3xl font-bold text-leather-800">
                {formatPrice(product.price)}
              </span>
            </div>

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

            {/* Actions */}
            <div className="space-y-4 mb-8">
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Agregar al Carrito</span>
              </button>
              
              <div className="flex space-x-3">
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="w-6 h-6 text-leather-600" />
                  <span className="text-sm text-gray-600">Envío Gratis</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="w-6 h-6 text-leather-600" />
                  <span className="text-sm text-gray-600">Garantía</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-leather-600" />
                  <span className="text-sm text-gray-600">Devolución</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-leather-800 mb-8">
            Productos Relacionados
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {/* Placeholder for related products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
