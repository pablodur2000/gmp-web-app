import { Link } from 'react-router-dom'
import { ArrowRight, Shield, MapPin, Truck, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import HeroSection from '../components/HeroSection'
import FeaturedProducts from '../components/FeaturedProducts'
import AboutGMPSection from '../components/AboutGMPSection'

const HomePage = () => {
  const [animatedSections, setAnimatedSections] = useState({
    location: false,
    shipping: false,
    quality: false,
    locationIcon: false
  })
  const [showMapModal, setShowMapModal] = useState(false)

  // Fix Leaflet default icon issue
  useEffect(() => {
    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])

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

      {/* Location Section */}
      <section className="py-16 bg-gradient-to-br from-leather-50 to-white" data-testid="home-location-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4" data-testid="home-location-heading">
              Ubicación
            </h2>

          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Location Info */}
            <div className="space-y-8">
              <div 
                className={`flex items-start space-x-4 transition-all duration-1000 ease-out ${
                  animatedSections.location 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-16 opacity-0'
                }`}
                data-section="location"
                data-testid="home-location-info-card-tienda-fisica"
              >
                <div className="w-12 h-12 bg-leather-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-leather-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-leather-800 mb-2">
                    Tienda Física
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 leading-relaxed">
                      Nuestra tienda está ubicada físicamente en el local llamado <strong className="text-leather-700">Paquetitos</strong>.
                    </p>
                    <div className="bg-leather-50 rounded-lg p-3 border border-leather-200" data-testid="home-location-address-card">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-leather-800" data-testid="home-location-address-text">
                            📍 José Pedro Varela 451
                          </p>
                          <p className="text-xs text-leather-600">
                            Paysandú, Uruguay
                          </p>
                        </div>
                        <button
                          onClick={() => setShowMapModal(true)}
                          className="ml-4 inline-flex items-center space-x-2 text-leather-600 hover:text-leather-800 transition-colors duration-200 cursor-pointer"
                          data-testid="home-location-ver-mapa-button"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span className="text-sm font-medium">Ver mapa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`flex items-start space-x-4 transition-all duration-1000 ease-out delay-200 ${
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
                className={`flex items-start space-x-4 transition-all duration-1000 ease-out delay-400 ${
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

            {/* Map/Visual Element */}
            <div 
              className={`relative transition-all duration-1000 ease-out delay-600 ${
                animatedSections.locationIcon 
                  ? 'translate-x-0 opacity-100 scale-100' 
                  : 'translate-x-16 opacity-0 scale-95'
              }`}
              data-section="locationIcon"
            >
              <div className="bg-leather-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-leather-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-leather-800 mb-3">
                  Paquetitos
                </h3>
                <p className="text-leather-700 mb-2" data-testid="home-location-map-address">
                  José Pedro Varela 451
                </p>
                <p className="text-leather-600 mb-6 text-sm">
                  Paysandú, Uruguay
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

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-leather-800">
                  Ubicación de Paquetitos
                </h3>
                <button
                  onClick={() => setShowMapModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Cerrar</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                José Pedro Varela 451, Paysandú, Uruguay
              </p>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-lg h-96 overflow-hidden">
                <MapContainer
                  center={[-32.3277, -58.0794] as [number, number]}
                  zoom={18}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[-32.3277, -58.0794] as [number, number]}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold text-leather-800">Local y Papelería Paquetitos</h3>
                        <p className="text-sm text-gray-600">José Pedro Varela 451</p>
                        <p className="text-xs text-gray-500">Paysandú, Uruguay</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://www.google.com/maps/place/Local+y+Papeleria+Paquetitos/@-32.3276318,-58.0795633,20.5z/data=!4m15!1m8!3m7!1s0x95afc943140c995b:0xf99d88f8dba5692b!2sJose+Pedro+Varela+451,+60000+Paysand%C3%BA,+Departamento+de+Paysand%C3%BA!3b1!8m2!3d-32.3277068!4d-58.0794427!16s%2Fg%2F11y32zdmpz!3m5!1s0x95afc9431674137d:0x87a6051bfdb83b60!8m2!3d-32.3275301!4d-58.0793683!16s%2Fg%2F11g81ftly_?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-leather-600 hover:bg-leather-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir en Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
