import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showFirstVisitAnimation, setShowFirstVisitAnimation] = useState(true)
  const [animationStep, setAnimationStep] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  
  // Hide header initially, scroll to top, and disable scroll during animation
  useEffect(() => {
    // Scroll to top on page load/reload
    window.scrollTo(0, 0)
    
    const header = document.querySelector('header')
    if (header) {
      header.classList.add('header-hidden')
    }
    
    // Disable scroll during animation
    document.body.style.overflow = 'hidden'
    
    // Re-enable scroll after animation completes
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])
  
  const slides = [
    {
      image: 'https://img77.uenicdn.com/image/upload/v1537288442/service_images/shutterstock_720051730.jpg',
      title: 'Artesanías en Cuero',
      subtitle: 'Hechas con Amor y Tradición',
      description: 'Descubre la belleza y calidad de nuestras piezas únicas, creadas artesanalmente con las mejores técnicas y materiales premium'
    },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
      title: 'Macramé Artesanal',
      subtitle: 'Tejidos que Transforman Espacios',
      description: 'Explora nuestros diseños únicos en macramé para decorar tu hogar con elegancia y estilo artesanal'
    },
    {
      image: 'https://i.etsystatic.com/9876280/r/il/7087e1/6417778296/il_fullxfull.6417778296_bo6y.jpg',
      title: 'Desde Paysandú',
      subtitle: 'Para Todo Uruguay',
      description: 'Nuestras artesanías llegan a todos los rincones del país a través de DAC, manteniendo la calidad y el cuidado en cada envío'
    },
    {
      image: 'https://leonikapiel.com/wp-content/uploads/2021/02/monedero-artesanal-de-piel-cartera-de-piel-azul-colores-leonikapiel-monedero-artesano-de-cuero-de-moda-para-mujer-leonika-piel-4-2.jpg',
      title: 'Monederos Artesanales',
      subtitle: 'Detalles que Marcan la Diferencia',
      description: 'Pequeñas piezas con grandes detalles, cada monedero cuenta una historia de dedicación y pasión por el cuero'
    }
  ]

  // First visit animation sequence
  useEffect(() => {
    if (!showFirstVisitAnimation) return
    
    const animationSequence = async () => {
      // Step 1: Logo is already visible, start logo disappear (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnimationStep(1)
      
      // Step 2: Logo disappears, white curtain starts sliding up (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnimationStep(2)
      
      // Step 3: White curtain finishes sliding up to header height (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnimationStep(3)
      
      // Step 4: Header appears smoothly (0.5s)
      await new Promise(resolve => setTimeout(resolve, 500))
      setAnimationStep(4)
      setHeaderVisible(true)
      
      // Complete animation (total: 2.5s instead of 3s)
      setTimeout(() => {
        setShowFirstVisitAnimation(false)
        // Re-enable scroll after animation
        document.body.style.overflow = 'auto'
      }, 500)
    }
    
    animationSequence()
  }, [showFirstVisitAnimation])

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [slides.length])

  // Add parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const slides = document.querySelectorAll('.hero-slide')
      slides.forEach((slide: any) => {
        if (slide.style.opacity === '1') {
          const x = (e.clientX / window.innerWidth - 0.5) * 20
          const y = (e.clientY / window.innerHeight - 0.5) * 20
          slide.style.transform = `scale(1.1) translate(${x}px, ${y}px)`
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Control header visibility during first visit animation
  useEffect(() => {
    const header = document.querySelector('header')
    if (header) {
      if (headerVisible) {
        header.classList.remove('header-hidden')
        header.classList.add('header-visible')
      } else {
        header.classList.add('header-hidden')
        header.classList.remove('header-visible')
      }
    }
  }, [headerVisible])





  return (
    <>
      {/* First Visit Animation Overlay */}
      {showFirstVisitAnimation && (
        <>
          {/* Logo - shows immediately, then disappears */}
          <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
            animationStep >= 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            <div className="text-center">
              <div className="w-32 h-32 bg-leather-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-white font-bold">P</span>
              </div>
              <h1 className="text-3xl font-serif font-bold text-leather-800">
                Paquetitos
              </h1>
              <p className="text-leather-600 mt-2">Artesanías en Cuero</p>
            </div>
          </div>
          
                {/* White curtain that covers entire screen and slides UP smoothly */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-[500ms] ease-out ${
        animationStep >= 2 ? 'transform -translate-y-full' : 'transform translate-y-0'
      }`}></div>
    </>
  )}

  {/* Main Content - always visible but behind white curtain during animation */}
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[3000ms] ease-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            transform: index === currentSlide && animationStep >= 2 ? 'scale(1.1)' : 'scale(1)',
            transition: 'opacity 1000ms ease-out, transform 3000ms ease-out'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
          {slides[currentSlide].title}
          <span className="block text-2xl md:text-3xl font-normal mt-2 text-leather-200">
            {slides[currentSlide].subtitle}
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-leather-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          {slides[currentSlide].description}
        </p>

        <div className="flex justify-center items-center">
          <Link
            to="/catalogo"
            className="group bg-leather-600 hover:bg-leather-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>


      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-leather-600 bg-opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-600 bg-opacity-20 rounded-full blur-3xl"></div>
    </section>
    </>
  )
}

export default HeroSection
