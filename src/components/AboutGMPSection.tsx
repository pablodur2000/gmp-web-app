import { useState, useEffect } from 'react'
import { User } from 'lucide-react'

const AboutGMPSection = () => {
  const [animatedSections, setAnimatedSections] = useState({
    text: false,
    image: false
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

    // Observe animated sections
    const sections = document.querySelectorAll('[data-section]')
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="sobre-gmp" className="py-16 bg-gradient-to-br from-leather-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-leather-800 mb-4">
            Sobre GMP
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce la artesana detrás de cada pieza única
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              animatedSections.image 
                ? 'translate-x-0 opacity-100 scale-100' 
                : '-translate-x-16 opacity-0 scale-95'
            }`}
            data-section="image"
          >
            <div className="relative">
              <div className="bg-leather-100 rounded-2xl p-8 overflow-hidden">
                <img
                  src="https://media.istockphoto.com/id/1421303756/es/foto/joven-negra-que-trabaja-con-cuero.jpg?s=612x612&w=0&k=20&c=NkAq4LnhHMIZ5235P9CkEdkGlcRsiRn1wLpc-NAL--E="
                  alt="Gabriela Ponzoni trabajando con cuero"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-leather-300 rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Content */}
          <div 
            className={`space-y-6 transition-all duration-1000 ease-out delay-200 ${
              animatedSections.text 
                ? 'translate-x-0 opacity-100' 
                : 'translate-x-16 opacity-0'
            }`}
            data-section="text"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-leather-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-leather-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-leather-800 mb-4">
                  Gabriela Ponzoni
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    Artesana especializada en marroquinería y macramé con una pasión 
                    por crear piezas únicas que combinan tradición y modernidad.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Marroquinería:</strong> 2 años de estudio y práctica especializada en 
                    el trabajo con cuero, aprendiendo las técnicas tradicionales de corte, 
                    costura y acabado artesanal.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Macramé:</strong> 10 años de experiencia creando piezas únicas 
                    con nudos tradicionales, desarrollando un estilo propio que fusiona 
                    técnicas clásicas con diseños contemporáneos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutGMPSection
