"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createPatient } from "../_act/create-patient"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { formatPhone, formatCPF } from "@/lib/validations"
import { msgError, msgSuccess, msgWarning, msgInfo, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"
import { MapPin, Search, Loader2 } from "lucide-react"

interface CreatePatientFormProps {
  onSuccess: () => void
}

// Tipos para Google Places API
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

// Componente para seleção de endereço
const AddressSelector = ({ 
  onAddressSelect, 
  isOpen, 
  onOpenChange 
}: { 
  onAddressSelect: (address: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar Google Places API
  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsApiLoaded(true);
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY não configurada');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initAutocomplete`;
      script.async = true;
      script.defer = true;

      window.initAutocomplete = () => {
        setIsApiLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete window.initAutocomplete;
      };
    };

    if (isOpen) {
      loadGooglePlacesAPI();
    }
  }, [isOpen]);

  // Inicializar autocomplete quando API estiver carregada
  useEffect(() => {
    if (isApiLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'BR' }, // Apenas Brasil
          fields: ['formatted_address', 'place_id', 'geometry']
        }
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          handleAddressSelection(place.formatted_address);
        }
      });
    }
  }, [isApiLoaded]);

  const handleAddressSelection = useCallback((address: string) => {
    onAddressSelect(address);
    setSearchQuery('');
    setSuggestions([]);
    onOpenChange(false);
  }, [onAddressSelect, onOpenChange]);

  const searchManually = useCallback(async () => {
    if (!searchQuery.trim() || !isApiLoaded) return;

    setIsLoading(true);
    try {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        query: searchQuery,
        fields: ['formatted_address', 'place_id', 'geometry'],
        locationBias: {
          lat: -3.7319, // Fortaleza, CE
          lng: -38.5267
        }
      };

      service.textSearch(request, (results: PlaceResult[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setSuggestions(results.slice(0, 5)); // Limitar a 5 resultados
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      setIsLoading(false);
    }
  }, [searchQuery, isApiLoaded]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Buscar Endereço
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {/* Input de busca */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              placeholder="Digite o endereço ou nome do local..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  searchManually();
                }
              }}
              disabled={!isApiLoaded}
            />
          </div>
          <Button
            onClick={searchManually}
            disabled={!searchQuery.trim() || isLoading || !isApiLoaded}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status da API */}
        {!isApiLoaded && (
          <div className="text-sm text-gray-500 text-center py-4">
            Carregando Google Places API...
          </div>
        )}

        {/* Sugestões manuais */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Sugestões:</p>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {suggestions.map((place, index) => (
                <button
                  key={place.place_id || index}
                  onClick={() => handleAddressSelection(place.formatted_address)}
                  className="w-full p-2 text-left text-sm hover:bg-gray-100 rounded border transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{place.formatted_address}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {!isLoading && searchQuery && suggestions.length === 0 && isApiLoaded && (
          <div className="text-sm text-gray-500 text-center py-4">
            Nenhum endereço encontrado. Tente uma busca diferente.
          </div>
        )}

        {/* Instruções */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          💡 <strong>Dica:</strong> Digite o nome do estabelecimento, rua ou ponto de referência. 
          A busca funciona melhor com informações específicas como "Rua João Pessoa, Fortaleza" 
          ou "Shopping Iguatemi Fortaleza".
        </div>
      </div>
    </DialogContent>
  );
};

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useCreatePatientForm()

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    
    const loadingToastId = msgLoading("Cadastrando paciente...")
    
    try {
      const result = await createPatient(data)
      
      toast.dismiss(loadingToastId)
      
      if (result.success) {
        msgSuccess("Paciente cadastrado com sucesso!")
        reset()
        onSuccess()
      } else {
        // Tratar diferentes tipos de erro
        if (result.fieldErrors) {
          // Mostrar erros específicos dos campos
          Object.entries(result.fieldErrors).forEach(([field, errors]) => {
            if (errors && errors[0]) {
              msgError(`${field}: ${errors[0]}`)
            }
          })
        } else if (result.error?.includes('Limite')) {
          msgWarning(result.error || "Limite do plano atingido")
        } else if (result.error?.includes('já existe')) {
          msgWarning(result.error || "Paciente já cadastrado")
        } else {
          msgError(result.error || "Erro ao cadastrar paciente")
        }
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Formatação automática durante digitação
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setValue('cpf', formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('telefone', formatted)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      {/* 👤 DADOS PESSOAIS */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Dados Pessoais</h3>
        
        {/* Nome */}
        <div>
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            {...register("nome")}
            placeholder="Digite o nome completo do paciente"
            disabled={isLoading}
            className={errors.nome ? "border-red-500" : ""}
          />
          {errors.nome?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPF */}
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              {...register("cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={handleCPFChange}
              disabled={isLoading}
              className={errors.cpf ? "border-red-500" : ""}
            />
            {errors.cpf?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.cpf.message)}</p>
            )}
          </div>

          {/* Data de Nascimento */}
          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              {...register("dataNascimento")}
              disabled={isLoading}
              className={errors.dataNascimento ? "border-red-500" : ""}
            />
            {errors.dataNascimento?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.dataNascimento.message)}</p>
            )}
          </div>
        </div>

        {/* Endereço */}
        <div>
          <Label htmlFor="endereco">Endereço</Label>
          <div className="flex gap-2">
            <Input
              id="endereco"
              {...register("endereco")}
              placeholder="Rua, número, bairro, cidade"
              disabled={isLoading}
              className={`flex-1 ${errors.endereco ? "border-red-500" : ""}`}
            />
            <Dialog 
              open={isAddressSelectorOpen} 
              onOpenChange={setIsAddressSelectorOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 px-3 h-9 bg-blue-600 text-white hover:bg-blue-500 shadow-blue-200 hover:text-white hover:shadow-md w-fit font-semibold cursor-pointer"
                  title="Buscar endereço no Google Maps"
                  disabled={isLoading}
                >
                  <MapPin className="w-4 h-4" />
                  Buscar
                </Button>
              </DialogTrigger>
              <AddressSelector
                onAddressSelect={(address) => {
                  setValue('endereco', address);
                }}
                isOpen={isAddressSelectorOpen}
                onOpenChange={setIsAddressSelectorOpen}
              />
            </Dialog>
          </div>
          {errors.endereco?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.endereco.message)}</p>
          )}
        </div>
      </div>

      {/* 📞 CONTATOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Contatos</h3>
        
        {/* Telefone */}
        <div>
          <Label htmlFor="telefone">Telefone Principal *</Label>
          <Input
            id="telefone"
            {...register("telefone")}
            placeholder="(85) 99999-9999"
            maxLength={15}
            onChange={handlePhoneChange}
            disabled={isLoading}
            className={errors.telefone ? "border-red-500" : ""}
          />
          {errors.telefone?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.telefone.message)}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="paciente@exemplo.com"
            disabled={isLoading}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
          )}
        </div>
      </div>

      {/* 🏥 CONVÊNIO */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Convênio (Opcional)</h3>
        
        {/* Convênio */}
        <div>
          <Label htmlFor="convenio">Nome do Convênio</Label>
          <Input
            id="convenio"
            {...register("convenio")}
            placeholder="Ex: Unimed, Hapvida, etc."
            disabled={isLoading}
            className={errors.convenio ? "border-red-500" : ""}
          />
          {errors.convenio?.message && (
            <p className="text-sm text-red-500 mt-1">{String(errors.convenio.message)}</p>
          )}
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Cadastrando..." : "Cadastrar Paciente"}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => reset()}
          disabled={isLoading}
          className="px-8"
        >
          Limpar
        </Button>
      </div>

      {/* Info sobre campos obrigatórios */}
      <p className="text-sm text-gray-500 text-center">
        * Campos obrigatórios
      </p>
    </form>
  )
}