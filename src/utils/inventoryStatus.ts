import { InventoryStatus } from '../types'

export interface InventoryStatusInfo {
  label: string
  color: string
  bgColor: string
  message?: string
}

export const getInventoryStatusInfo = (status: InventoryStatus): InventoryStatusInfo => {
  switch (status) {
    case 'disponible_pieza_unica':
      return {
        label: 'Pieza Única',
        color: 'text-purple-800',
        bgColor: 'bg-purple-100',
        message: 'Entrega inmediata - Pieza única'
      }
    
    case 'disponible_encargo_mismo_material':
      return {
        label: 'Encargo Mismo Material',
        color: 'text-blue-800',
        bgColor: 'bg-blue-100',
        message: 'Encargalo, se hace igual en 3-4 días o más dependiendo complejidad'
      }
    
    case 'disponible_encargo_diferente_material':
      return {
        label: 'Encargo Diferente Material',
        color: 'text-orange-800',
        bgColor: 'bg-orange-100',
        message: 'Se hace a medida, elegí el material en contacto por WhatsApp/Instagram'
      }
    
    case 'no_disponible':
      return {
        label: 'No Disponible',
        color: 'text-red-800',
        bgColor: 'bg-red-100',
        message: 'Temporalmente no disponible'
      }
    
    default:
      return {
        label: 'Estado Desconocido',
        color: 'text-gray-800',
        bgColor: 'bg-gray-100'
      }
  }
}
