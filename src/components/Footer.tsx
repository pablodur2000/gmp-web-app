import { Link } from 'react-router-dom'
import { Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react'
import logo from '../img/logo.png'

interface FooterProps {
  onOpenContact: () => void
}

const Footer = ({ onOpenContact }: FooterProps) => {
  return (
    <footer className="bg-leather-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-12 flex items-center justify-center">
                <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/gmp.artesanias/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-leather-800 rounded-full flex items-center justify-center text-leather-200 hover:bg-leather-700 hover:text-white transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-leather-800 rounded-full flex items-center justify-center text-leather-200 hover:bg-leather-700 hover:text-white transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-leather-800 rounded-full flex items-center justify-center text-leather-200 hover:bg-leather-700 hover:text-white transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-leather-200 hover:text-white transition-colors duration-200">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-leather-200 hover:text-white transition-colors duration-200">
                  Catálogo
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('sobre-gmp')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="text-leather-200 hover:text-white transition-colors duration-200"
                >
                  Sobre GMP
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="text-leather-200 hover:text-white transition-colors duration-200 text-left"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-leather-400" />
                <span className="text-leather-200">098702414</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-leather-400" />
                <span className="text-leather-200">Paysandú Uruguay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-leather-800 mt-8 pt-8 text-center">
          <p className="text-leather-300">
            © 2024 Artesanías en Cuero. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
