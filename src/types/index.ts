export type InventoryStatus = 'disponible_pieza_unica' | 'disponible_encargo_mismo_material' | 'disponible_encargo_diferente_material' | 'no_disponible'

export interface Product {
  id: string
  title: string
  description: string
  short_description: string
  price: number
  category_id: string
  available: boolean
  featured: boolean
  inventory_status: InventoryStatus
  main_category: 'cuero' | 'macrame'
  images: string[]
  created_at: string
  updated_at: string
  categories?: {
    id: string
    name: string
    description: string
    main_category: 'cuero' | 'macrame'
  }
}

export interface Category {
  id: string
  name: string
  description: string
  image?: string
  main_category: 'cuero' | 'macrame'
  product_count: number
  created_at: string
  updated_at: string
}

export interface NavigationItem {
  name: string
  href: string
  hasDropdown?: boolean
}

export interface HeroSection {
  title: string
  subtitle: string
  description: string
  ctaText: string
  backgroundImage: string
}

export interface Testimonial {
  id: string
  name: string
  comment: string
  rating: number
  avatar?: string
}
