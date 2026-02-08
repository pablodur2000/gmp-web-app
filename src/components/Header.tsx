import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import { Category, NavigationItem } from '../types'
import { supabase } from '../lib/supabase'
import logo from '../img/logo.png'

interface HeaderProps {
  onOpenContact: () => void
}

const Header = ({ onOpenContact }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCatalogHovered, setIsCatalogHovered] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Load categories from database
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
          // Get product counts for each category
          const categoriesWithCounts = await Promise.all(
            data.map(async (category) => {
              const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', category.id)
                .eq('available', true)
                .neq('inventory_status', 'no_disponible')

              return { ...category, product_count: count || 0 }
            })
          )
          setCategories(categoriesWithCounts)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [])

  const navigation: NavigationItem[] = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo', hasDropdown: true },
    { name: 'Sobre GMP', href: '#sobre-gmp' },
    { name: 'Contacto', href: '/contacto', isModal: true },
  ]

  const handleSmoothScroll = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="h-14 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-full w-auto object-contain"
                  data-testid="header-logo"
                />
              </div>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" data-testid="header-nav">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                                 {item.hasDropdown ? (
                   <div
                     className="relative"
                     onMouseEnter={() => setIsCatalogHovered(true)}
                     onMouseLeave={() => setIsCatalogHovered(false)}
                   >
                     <div
                       className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100 cursor-pointer ${
                         isActive(item.href)
                           ? 'text-leather-800 bg-leather-100'
                           : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                       }`}
                     >
                       <Link 
                         to={item.href} 
                         className="flex items-center"
                         data-testid={item.name === 'Catálogo' ? 'header-nav-catalog-link' : undefined}
                       >
                         {item.name}
                       </Link>
                       <ChevronDown className="w-4 h-4" />
                     </div>
                     
                     {/* Dropdown Menu - Grouped by Main Category */}
                     {isCatalogHovered && (
                       <div
                         className="absolute top-full left-0 pt-2 w-[420px] z-50"
                         style={{
                           animation: 'fadeIn 0.1s ease-out forwards'
                         }}
                       >
                         <div
                           className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-[600px] overflow-y-auto"
                         >
                         {/* All Categories Link */}
                         <Link
                           to="/catalogo"
                           className="flex items-center justify-between px-4 py-3 hover:bg-leather-50 transition-colors duration-100 group border-b border-gray-100"
                         >
                           <div className="flex-1">
                             <div className="font-semibold text-leather-800 group-hover:text-leather-900">
                               Ver Todo el Catálogo
                             </div>
                             <div className="text-sm text-gray-500">
                               Todos los productos
                             </div>
                           </div>
                         </Link>

                         {/* Group categories by main_category */}
                         {(() => {
                           const groupedCategories = categories.reduce((groups, category) => {
                             const mainCat = category.main_category || 'cuero'
                             if (!groups[mainCat]) {
                               groups[mainCat] = []
                             }
                             groups[mainCat].push(category)
                             return groups
                           }, {} as Record<string, Category[]>)

                           const mainCategoryNames: Record<string, string> = {
                             'cuero': 'Artesanías en Cuero',
                             'macrame': 'Macramé Artesanal'
                           }

                           return Object.entries(groupedCategories).map(([mainCat, subCategories]) => (
                             <div key={mainCat} className="border-b border-gray-100 last:border-b-0">
                               {/* Main Category Header */}
                               <div className="px-4 py-2 bg-leather-50">
                                 <div className="text-xs font-semibold text-leather-700 uppercase tracking-wide">
                                   {mainCategoryNames[mainCat] || mainCat}
                                 </div>
                               </div>
                               
                               {/* Subcategories */}
                               {subCategories
                                 .sort((a, b) => a.name.localeCompare(b.name))
                                 .map((category) => (
                                   <Link
                                     key={category.id}
                                     to={`/catalogo?categoria=${encodeURIComponent(category.name)}`}
                                     className="flex items-center justify-between px-6 py-3 hover:bg-leather-50 transition-colors duration-100 group"
                                   >
                                     <div className="flex-1">
                                       <div className="font-medium text-gray-900 group-hover:text-leather-800">
                                         {category.name}
                                       </div>
                                       <div className="text-sm text-gray-500">
                                         {category.description}
                                       </div>
                                     </div>
                                     <div className="flex items-center space-x-2 ml-3">
                                       {category.product_count > 0 && (
                                         <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                           {category.product_count}
                                         </span>
                                       )}
                                       <div className="w-2 h-2 bg-leather-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
                                     </div>
                                   </Link>
                                 ))}
                             </div>
                           ))
                         })()}
                         </div>
                       </div>
                     )}
                   </div>
                ) : item.isModal ? (
                  <button
                    onClick={onOpenContact}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100 ${
                      'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <button
                    onClick={() => item.href.startsWith('#') ? handleSmoothScroll(item.href) : navigate(item.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100 ${
                      isActive(item.href)
                        ? 'text-leather-800 bg-leather-100'
                        : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                    }`}
                    data-testid={item.name === 'Inicio' ? 'header-nav-home-link' : undefined}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/catalogo"
              className="btn-primary flex items-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Catálogo</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-leather-800 hover:bg-leather-50"
            data-testid="header-mobile-menu-button"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => {
                          navigate(item.href)
                          setIsMenuOpen(false)
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-100 ${
                          isActive(item.href)
                            ? 'text-leather-800 bg-leather-100'
                            : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                        }`}
                      >
                        {item.name}
                      </button>
                      {/* Mobile Category Dropdown */}
                      <div className="pl-4 space-y-1 mt-1">
                        <Link
                          to="/catalogo"
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-leather-800 hover:bg-leather-50 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Ver Todo
                        </Link>
                        {(() => {
                          const groupedCategories = categories.reduce((groups, category) => {
                            const mainCat = category.main_category || 'cuero'
                            if (!groups[mainCat]) {
                              groups[mainCat] = []
                            }
                            groups[mainCat].push(category)
                            return groups
                          }, {} as Record<string, Category[]>)

                          return Object.entries(groupedCategories).map(([mainCat, subCategories]) => (
                            <div key={mainCat} className="space-y-1">
                              <div className="px-3 py-1 text-xs font-semibold text-leather-700 uppercase">
                                {mainCat === 'cuero' ? 'Artesanías en Cuero' : 'Macramé Artesanal'}
                              </div>
                              {subCategories
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((category) => (
                                  <Link
                                    key={category.id}
                                    to={`/catalogo?categoria=${encodeURIComponent(category.name)}`}
                                    className="block px-6 py-2 text-sm text-gray-600 hover:text-leather-800 hover:bg-leather-50 rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {category.name}
                                    {category.product_count > 0 && (
                                      <span className="ml-2 text-xs text-gray-400">
                                        ({category.product_count})
                                      </span>
                                    )}
                                  </Link>
                                ))}
                            </div>
                          ))
                        })()}
                      </div>
                    </div>
                  ) : item.isModal ? (
                    <button
                      onClick={() => {
                        onOpenContact()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-100 text-gray-600 hover:text-leather-800 hover:bg-leather-50"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.href.startsWith('#')) {
                          handleSmoothScroll(item.href)
                        } else {
                          navigate(item.href)
                        }
                        setIsMenuOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-100 ${
                        isActive(item.href)
                          ? 'text-leather-800 bg-leather-100'
                          : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
              <Link
                to="/catalogo"
                className="block px-3 py-2 mt-4 btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Ver Catálogo
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
