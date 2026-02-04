import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ContactModal from './ContactModal'

const Layout = () => {
  const [showContactModal, setShowContactModal] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenContact={() => setShowContactModal(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onOpenContact={() => setShowContactModal(true)} />
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </div>
  )
}

export default Layout
