import { useState } from 'react'
import { X, Phone, MapPin, Instagram, MessageCircle, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Save to database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            message: formData.message.trim()
          }
        ])
        .select()

      if (error) {
        console.error('Error saving message to database:', error)
        alert('Hubo un error al guardar el mensaje. Por favor, intenta nuevamente.')
        return
      }

      console.log('Message saved successfully:', data)

      // Show success and reset form
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.1s_ease-out_forwards]"
      onClick={handleBackdropClick}
      style={{ animation: 'fadeIn 0.1s ease-out forwards' }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-leather-600 to-leather-800 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-white">
              Contáctanos
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-leather-200 transition-colors duration-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-leather-100 text-sm mt-1">
            Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Contact Form - Left Side */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-leather-800 mb-4">
                Envíanos un Mensaje
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent transition-colors duration-100 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent transition-colors duration-100 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent transition-colors duration-100"
                    placeholder="+598 12 345 678"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent transition-colors duration-100 resize-none ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                  />
                  {errors.message && (
                    <p className="text-red-600 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="w-full bg-leather-600 hover:bg-leather-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : submitSuccess ? (
                    <>
                      <Send className="w-5 h-5" />
                      <span>¡Mensaje Enviado!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Contact Info - Right Side */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-leather-800 mb-4">
                Información de Contacto
              </h3>

              {/* Phone */}
              <a
                href="https://wa.me/59898702414"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-4 bg-leather-50 rounded-lg border border-leather-200 hover:bg-leather-100 transition-colors duration-100 group"
              >
                <div className="p-2 bg-leather-600 rounded-lg group-hover:bg-leather-700 transition-colors duration-100">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-leather-800 mb-1">Teléfono</h4>
                  <p className="text-gray-600 text-sm">098 702 414</p>
                  <p className="text-leather-600 text-xs mt-1 group-hover:underline">
                    Abrir WhatsApp →
                  </p>
                </div>
              </a>

              {/* Address */}
              <a
                href="https://www.google.com/maps/place/Local+y+Papeleria+Paquetitos/@-32.3276318,-58.0795633,20.5z/data=!4m15!1m8!3m7!1s0x95afc943140c995b:0xf99d88f8dba5692b!2sJose+Pedro+Varela+451,+60000+Paysand%C3%BA,+Departamento+de+Paysand%C3%BA!3b1!8m2!3d-32.3277068!4d-58.0794427!16s%2Fg%2F11y32zdmpz!3m5!1s0x95afc9431674137d:0x87a6051bfdb83b60!8m2!3d-32.3275301!4d-58.0793683!16s%2Fg%2F11g81ftly_?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-4 bg-leather-50 rounded-lg border border-leather-200 hover:bg-leather-100 transition-colors duration-100 group"
              >
                <div className="p-2 bg-leather-600 rounded-lg group-hover:bg-leather-700 transition-colors duration-100">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-leather-800 mb-1">Dirección</h4>
                  <p className="text-gray-600 text-sm">José Pedro Varela 451</p>
                  <p className="text-gray-600 text-sm">Paysandú, Uruguay</p>
                  <p className="text-leather-600 text-xs mt-1 group-hover:underline">
                    Ver en Google Maps →
                  </p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/gmp.artesanias/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-4 bg-leather-50 rounded-lg border border-leather-200 hover:bg-leather-100 transition-colors duration-100 group"
              >
                <div className="p-2 bg-leather-600 rounded-lg group-hover:bg-leather-700 transition-colors duration-100">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-leather-800 mb-1">Instagram</h4>
                  <p className="text-gray-600 text-sm">Síguenos en Instagram</p>
                  <p className="text-leather-600 text-xs mt-1 group-hover:underline">
                    Ver perfil →
                  </p>
                </div>
              </a>

              {/* Instagram Direct */}
              <a
                href="https://www.instagram.com/gmp.artesanias/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-4 bg-leather-50 rounded-lg border border-leather-200 hover:bg-leather-100 transition-colors duration-100 group"
              >
                <div className="p-2 bg-leather-600 rounded-lg group-hover:bg-leather-700 transition-colors duration-100">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-leather-800 mb-1">Mensaje Directo</h4>
                  <p className="text-gray-600 text-sm">Envíanos un DM en Instagram</p>
                  <p className="text-leather-600 text-xs mt-1 group-hover:underline">
                    Abrir Instagram →
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactModal

