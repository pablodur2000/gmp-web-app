import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Category } from '../types'
import { supabase } from '../lib/supabase'

const CategoryShowcase = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('main_category')
          .order('name')
        
        if (error) {
          console.error('Error loading categories:', error)
          return
        }
        
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  const cueroCategories = categories.filter(c => c.main_category === 'cuero')
  const macrameCategories = categories.filter(c => c.main_category === 'macrame')

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leather-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4">
            Explora por Categorías
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas en nuestras colecciones organizadas
          </p>
        </div>

        {/* Cuero Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-center mb-8 text-leather-800">
            Artesanías en Cuero
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cueroCategories.map((category) => (
              <Link
                key={category.id}
                to={`/catalogo?categoria=${category.name.toLowerCase()}`}
                className="group block"
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                  {/* Category Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Category Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-leather-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.product_count} productos
                      </span>
                      <ArrowRight className="w-4 h-4 text-leather-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Macramé Section */}
        {macrameCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-center mb-8 text-leather-800">
              Macramé Artesanal
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {macrameCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/catalogo?categoria=${category.name.toLowerCase()}`}
                  className="group block"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                    {/* Category Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-leather-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {category.product_count} productos
                        </span>
                        <ArrowRight className="w-4 h-4 text-leather-600 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/catalogo"
            className="btn-secondary inline-flex items-center space-x-2"
          >
            <span>Ver Todas las Categorías</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
