import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Product } from '../types'
import { getInventoryStatusInfo } from '../utils/inventoryStatus'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
}

const ProductCard = ({ product, viewMode }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0
    }).format(price)
  }

  const statusInfo = getInventoryStatusInfo(product.inventory_status)
  const isEncargoDiferenteMaterial = product.inventory_status === 'por_encargue_sin_stock'

  if (viewMode === 'list') {
    return (
      <div className="card p-6" data-testid={`catalog-product-card-${product.id}`}>
        <div className="flex gap-6">
          {/* Product Image - Clickable */}
          <Link to={`/producto/${product.id}`} className="w-32 h-32 flex-shrink-0 cursor-pointer">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
            />
          </Link>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {product.title}
              </h3>
            </div>
            
            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 mb-2">{product.short_description}</p>
            )}
            
            {/* Full Description (shorter version) */}
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {product.description.length > 150 
                ? `${product.description.substring(0, 150)}...` 
                : product.description
              }
            </p>
            
            {/* Inventory Status Badge */}
            <div className="mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
            
            {/* Special Message for Encargo Diferente Material */}
            {isEncargoDiferenteMaterial && (
              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-1 text-orange-700">
                  <span className="text-xs">
                    Se hace a medida, elegí el material en contacto por WhatsApp/Instagram
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-leather-800">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <Link
                to={`/producto/${product.id}`}
                className="btn-primary flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver Detalles</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="card group overflow-hidden" data-testid={`catalog-product-card-${product.id}`}>
      {/* Product Image - Clickable */}
      <Link to={`/producto/${product.id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Destacado
          </div>
        )}
        
        {/* Price Tag - Top Right */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-95 text-leather-800 font-bold px-3 py-2 rounded-lg shadow-md">
          {formatPrice(product.price)}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-leather-600 transition-colors duration-200">
          {product.title}
        </h3>
        
        {/* Short Description */}
        {product.short_description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}
        
        {/* Inventory Status Badge */}
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        
        {/* Special Message for Encargo Diferente Material */}
        {isEncargoDiferenteMaterial && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-orange-700">
              <span className="text-xs">
                Se hace a medida, elegí el material en contacto por WhatsApp/Instagram
              </span>
            </div>
          </div>
        )}
        
        <Link
          to={`/producto/${product.id}`}
          className="mt-4 w-full btn-primary text-center block"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
