// ================================================================
// 🗺️ ADDRESS COMPONENTS - Exports Centralizados
// ================================================================
// Arquivo de índice para componentes relacionados a endereços

export { AddressSelector } from './AddressSelector'

// Re-exportar tipos úteis se necessário
export type AddressSelectorProps = {
  onAddressSelect: (address: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLocation?: {
    lat: number;
    lng: number;
  };
  placeholder?: string;
  title?: string;
}