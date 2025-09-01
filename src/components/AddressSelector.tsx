// ================================================================
// 🗺️ ADDRESS SELECTOR - Componente de Busca de Endereços
// ================================================================
// Componente reutilizável para busca de endereços com Google Places API

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Search, Loader2 } from "lucide-react"

// ===============================================
// 🌍 TIPOS PARA GOOGLE PLACES API
// ===============================================

declare global {
  interface Window {
    google: any;
    initAutocomplete?: () => void;
  }
}

interface PlaceResult {
  formatted_address: string;
  place_id: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
}

// ===============================================
// 📍 TIPOS EXPORTÁVEIS
// ===============================================

export interface AddressSelectorProps {
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

// ===============================================
// 🗺️ COMPONENTE PRINCIPAL
// ===============================================

export function AddressSelector({ 
  onAddressSelect, 
  isOpen, 
  onOpenChange,
  defaultLocation = { lat: -3.7319, lng: -38.5267 }, // Fortaleza, CE como padrão
  placeholder = "Digite o endereço ou nome do local...",
  title = "Buscar Endereço"
}: AddressSelectorProps) {
  // ===============================================
  // 🎯 ESTADOS DO COMPONENTE
  // ===============================================
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando Google Places API...');
  
  // Refs para controle da API
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ===============================================
  // 🚀 CARREGAR GOOGLE PLACES API
  // ===============================================

  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      // Verificar se API já está carregada
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiLoaded(true);
        return;
      }

      // Verificar se API key existe
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada');
        setLoadingMessage('API Key do Google Maps não configurada');
        return;
      }

      // Criar script para carregar API
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      
      if (existingScript) {
        // Script já existe, aguardar carregamento
        const checkLoad = setInterval(() => {
          if (window.google && window.google.maps && window.google.maps.places) {
            setIsApiLoaded(true);
            clearInterval(checkLoad);
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkLoad);
          if (!isApiLoaded) {
            setLoadingMessage('Erro ao carregar Google Places API');
          }
        }, 10000); // Timeout de 10 segundos
        
        return;
      }

      // Criar novo script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsAPI`;
      script.async = true;
      script.defer = true;

      // Função de callback global
      (window as any).initGoogleMapsAPI = () => {
        setIsApiLoaded(true);
        delete (window as any).initGoogleMapsAPI;
      };

      // Handlers de erro
      script.onerror = () => {
        console.error('❌ Erro ao carregar Google Places API');
        setLoadingMessage('Erro ao carregar API do Google Maps');
      };

      document.head.appendChild(script);

      // Cleanup
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        delete (window as any).initGoogleMapsAPI;
      };
    };

    if (isOpen) {
      loadGooglePlacesAPI();
    }
  }, [isOpen]);

  // ===============================================
  // 🎯 INICIALIZAR AUTOCOMPLETE
  // ===============================================

  useEffect(() => {
    if (isApiLoaded && inputRef.current && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'BR' },
            fields: ['formatted_address', 'place_id', 'geometry', 'name']
          }
        );

        // Listener para quando local é selecionado
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            handleAddressSelection(place.formatted_address);
          }
        });

        console.log('✅ Google Places Autocomplete inicializado');
      } catch (error) {
        console.error('❌ Erro ao inicializar autocomplete:', error);
        setLoadingMessage('Erro ao inicializar busca de endereços');
      }
    }
  }, [isApiLoaded]);

  // ===============================================
  // 🎯 HANDLERS DE EVENTOS
  // ===============================================

  const handleAddressSelection = useCallback((address: string) => {
    onAddressSelect(address);
    setSearchQuery('');
    setSuggestions([]);
    onOpenChange(false);
  }, [onAddressSelect, onOpenChange]);

  const searchManually = useCallback(async () => {
    if (!searchQuery.trim() || !isApiLoaded) return;

    setIsLoading(true);
    setSuggestions([]);
    
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        query: searchQuery.trim(),
        fields: ['formatted_address', 'place_id', 'geometry', 'name'],
        locationBias: new window.google.maps.Circle({
          center: { lat: defaultLocation.lat, lng: defaultLocation.lng },
          radius: 50000 // 50km de raio
        })
      };

      service.textSearch(request, (results: PlaceResult[] | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setSuggestions(results.slice(0, 8)); // Até 8 resultados
          console.log(`📍 Encontrados ${results.length} endereços para: ${searchQuery}`);
        } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setSuggestions([]);
          console.log('🔍 Nenhum resultado encontrado para:', searchQuery);
        } else {
          setSuggestions([]);
          console.warn('⚠️ Erro na busca:', status);
        }
        
        setIsLoading(false);
      });
    } catch (error) {
      console.error('❌ Erro ao buscar endereços:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  }, [searchQuery, isApiLoaded, defaultLocation]);

  // Handler para Enter no input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchManually();
    }
  };

  // ===============================================
  // 🎨 RENDERIZAÇÃO DO COMPONENTE
  // ===============================================

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          {title}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Input de busca */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!isApiLoaded || isLoading}
                className="h-10"
              />
            </div>
            <Button
              onClick={searchManually}
              disabled={!searchQuery.trim() || isLoading || !isApiLoaded}
              size="sm"
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Status da API */}
        {!isApiLoaded && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p className="text-sm text-gray-600">{loadingMessage}</p>
            </div>
          </div>
        )}

        {/* Sugestões */}
        {isApiLoaded && suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">
                Endereços encontrados ({suggestions.length})
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-1 border rounded-lg p-1">
              {suggestions.map((place, index) => (
                <button
                  key={place.place_id || index}
                  onClick={() => handleAddressSelection(place.formatted_address)}
                  className="w-full p-3 text-left text-sm hover:bg-blue-50 active:bg-blue-100 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-blue-400 group-hover:text-blue-600 flex-shrink-0" />
                    <span className="text-gray-900 group-hover:text-blue-900 leading-relaxed">
                      {place.formatted_address}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {isApiLoaded && !isLoading && searchQuery && suggestions.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500">
              Nenhum endereço encontrado para "<strong>{searchQuery}</strong>"
            </p>
            <p className="text-xs text-gray-400">
              Tente uma busca mais específica ou diferente
            </p>
          </div>
        )}

        {/* Instruções de uso */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <div className="text-blue-600">💡</div>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Dicas para melhor resultado:</strong></p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-600">
                <li>Digite nome do estabelecimento: "Shopping Iguatemi Fortaleza"</li>
                <li>Use rua completa: "Rua João Pessoa, 123, Fortaleza"</li>
                <li>Inclua bairro: "Centro, Fortaleza, CE"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}