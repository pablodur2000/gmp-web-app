import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder: string
  className?: string
}

const SearchBar = ({ value, onChange, onSearch, placeholder, className = '' }: SearchBarProps) => {
  // Determine data-testid based on placeholder to support different search contexts
  const getTestId = () => {
    if (placeholder.includes('productos')) {
      return 'admin-product-search-input'
    } else if (placeholder.includes('ventas')) {
      return 'admin-sales-search-input'
    } else if (placeholder.includes('categorías')) {
      return 'admin-category-search-input'
    } else if (placeholder.includes('actividad') || placeholder.includes('recurso')) {
      return 'admin-activity-search-input'
    }
    return 'search-input'
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch()
          }
        }}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leather-500 focus:border-transparent"
        data-testid={getTestId()}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  )
}

export default SearchBar
