import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck } from 'lucide-react'
import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedProducts from '../components/FeaturedProducts'
import AboutGMPSection from '../components/AboutGMPSection'

const HomePage = () => {
  const [animatedSections, setAnimatedSections] = useState({
    shipping: false,
    quality: false,
    deliveryCard: false
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section')
            if (sectionId) {
              setAnimatedSections(prev => ({
                ...prev,
                [sectionId]: true
              }))
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe all animated sections
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Shipping & Delivery Section */}
      <section className="py-16 bg-gradient-to-br from-leather-50 to-white" data-testid="home-location-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4" data-testid="home-location-heading">
              Envíos y Entrega
            </h2>

          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Shipping Info */}
            <div className="space-y-8">
              <div 
                className={`flex items-start space-x-4 transition-all duration-1000 ease-out ${
                  animatedSections.shipping 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-16 opacity-0'
                }`}
                data-section="shipping"
                data-testid="home-location-info-card-envios"
              >
                <div className="w-12 h-12 bg-leather-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-leather-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-leather-800 mb-2">
                    Envíos a Todo el País
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Realizamos envíos a través de DAC a todos los rincones de Uruguay, 
                    garantizando que nuestras artesanías lleguen seguras a tu puerta.
                  </p>
                </div>
              </div>

              <div 
                className={`flex items-start space-x-4 transition-all duration-1000 ease-out delay-200 ${
                  animatedSections.quality 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-16 opacity-0'
                }`}
                data-section="quality"
                data-testid="home-location-info-card-garantia"
              >
                <div className="w-12 h-12 bg-leather-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-leather-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-leather-800 mb-2">
                    Garantía de Calidad
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cada envío incluye seguimiento y aseguramiento, para que puedas 
                    disfrutar de nuestras artesanías con total tranquilidad.
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Card */}
            <div 
              className={`relative transition-all duration-1000 ease-out delay-400 ${
                animatedSections.deliveryCard 
                  ? 'translate-x-0 opacity-100 scale-100' 
                  : 'translate-x-16 opacity-0 scale-95'
              }`}
              data-section="deliveryCard"
            >
              <div className="bg-leather-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-leather-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-leather-800 mb-3">
                  Desde Paysandú
                </h3>
                <p className="text-leather-600 mb-6">
                  Realizamos envíos a todo Uruguay
                </p>
                <div className="flex flex-col items-center space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full">
                    <Truck className="w-4 h-4 text-leather-600" />
                    <span className="text-sm font-medium text-leather-800">
                      Envíos DAC
                    </span>
                  </div>
                  <a
                    href="https://www.dac.com.uy/envios/rastrear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-leather-600 hover:bg-leather-700 text-white px-4 py-2 rounded-full transition-colors duration-200"
                    data-testid="home-location-rastrear-envio-link"
                  >
                    <span className="text-sm font-medium">Rastrear Envío</span>
                  </a>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-leather-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About GMP */}
      <AboutGMPSection />

      {/* CTA Section */}
      <section className="py-16 bg-leather-800" data-testid="home-cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            ¿Listo para descubrir nuestras artesanías?
          </h2>
          <p className="text-xl text-leather-100 mb-8 max-w-2xl mx-auto">
            Explora nuestro catálogo completo y encuentra la pieza perfecta para ti o para regalar
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 bg-white text-leather-800 hover:bg-leather-50 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
            data-testid="home-cta-catalog-link"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  )
}

export default HomePage
