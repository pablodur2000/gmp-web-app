import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import { Category, NavigationItem } from '../types'
import logo from '../img/logo.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCatalogHovered, setIsCatalogHovered] = useState(false)
  const location = useLocation()

  // Mock categories - replace with Supabase query
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: '1', name: 'Billeteras', description: 'Billeteras y portamonedas', image: '', product_count: 5, main_category: 'cuero', created_at: '', updated_at: '' },
      { id: '2', name: 'Cinturones', description: 'Cinturones de cuero', image: '', product_count: 3, main_category: 'cuero', created_at: '', updated_at: '' },
      { id: '3', name: 'Bolsos', description: 'Bolsos y carteras', image: '', product_count: 4, main_category: 'cuero', created_at: '', updated_at: '' },
      { id: '4', name: 'Accesorios', description: 'Accesorios varios', image: '', product_count: 2, main_category: 'cuero', created_at: '', updated_at: '' }
    ]
    setCategories(mockCategories)
  }, [])

  const navigation: NavigationItem[] = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalogo', hasDropdown: true },
    { name: 'Sobre GMP', href: '#sobre-gmp' },
    { name: 'Contacto', href: '/contacto' },
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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="h-14 flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
              </div>
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                                 {item.hasDropdown ? (
                   <div
                     className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer ${
                       isActive(item.href)
                         ? 'text-leather-800 bg-leather-100'
                         : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                     }`}
                     onMouseEnter={() => setIsCatalogHovered(true)}
                     onMouseLeave={() => setIsCatalogHovered(false)}
                   >
                     <Link to={item.href} className="flex items-center">{item.name}</Link>
                     <ChevronDown className="w-4 h-4" />
                     
                     {/* Dropdown Menu */}
                     {isCatalogHovered && (
                       <div
                         className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                         onMouseEnter={() => setIsCatalogHovered(true)}
                         onMouseLeave={() => setIsCatalogHovered(false)}
                       >
                         {categories.map((category) => (
                           <Link
                             key={category.id}
                             to={`/catalogo?categoria=${category.name.toLowerCase()}`}
                             className="flex items-center justify-between px-4 py-3 hover:bg-leather-50 transition-colors duration-200 group"
                           >
                             <div className="flex-1">
                               <div className="font-medium text-gray-900 group-hover:text-leather-800">
                                 {category.name}
                               </div>
                               <div className="text-sm text-gray-500">
                                 {category.description}
                               </div>
                             </div>
                             <div className="w-2 h-2 bg-leather-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-3"></div>
                           </Link>
                         ))}
                         

                       </div>
                     )}
                   </div>
                ) : (
                  <button
                    onClick={() => item.href.startsWith('#') ? handleSmoothScroll(item.href) : window.location.href = item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
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
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.href.startsWith('#')) {
                      handleSmoothScroll(item.href)
                    } else {
                      window.location.href = item.href
                    }
                    setIsMenuOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-leather-800 bg-leather-100'
                      : 'text-gray-600 hover:text-leather-800 hover:bg-leather-50'
                  }`}
                >
                  {item.name}
                </button>
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
