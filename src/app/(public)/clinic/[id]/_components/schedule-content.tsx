"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import Image from "next/image"
import imgTest from '../../../../../../public/prof1.jpg'
import { CalendarArrowUp, MapPin, ChevronDown, ChevronUp, ExternalLink, Navigation, Loader2, Search } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { useAppointmentForm, AppointmentFormData } from './schedule-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatPhone } from '@/app/utils/formatPhone'
import { formatCPF, extractFormatCPF } from '@/app/utils/formatCPF'
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScheduleTimeList } from './schedule-time-list'
import { msgError, msgInfo, msgSuccess } from '@/components/custom-toast'
import { createNewAppointment } from '../_act/create-appointment'
import { useRouter } from 'next/navigation'
import { capitalizeProperNames } from "@/app/utils/formatName"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
    services: true,
  }
}>

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string;
  available: boolean;
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

// Componente separado para o mapa
const GoogleMapsEmbed = ({ address, isOpen }: { address: string; isOpen: boolean }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const embedUrl = useMemo(() => {
    if (!address || !apiKey) return '';
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
  }, [address, apiKey]);

  const openGoogleMaps = useCallback(() => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  }, [address]);

  const getDirections = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const encodedAddress = encodeURIComponent(address);
          const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodedAddress}`;
          window.open(directionsUrl, '_blank');
        },
        () => openGoogleMaps() // Fallback se geolocalização falhar
      );
    } else {
      openGoogleMaps();
    }
  }, [address, openGoogleMaps]);

  if (!isOpen) return null;

  return (
    <div className="mt-3 bg-white rounded-lg shadow-lg border">
      {address ? (
        <>
          {/* Google Maps Embed */}
          <div className="h-64 w-full rounded-t-lg overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
                title={`Mapa de ${address}`}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">API do Google Maps não configurada</p>
                  <p className="text-xs">Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Botões de ação */}
          <div className="p-4 border-t bg-gray-50 rounded-b-lg">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={openGoogleMaps}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir no Maps
              </Button>
              <Button
                onClick={getDirections}
                variant="default"
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Navigation className="w-4 h-4" />
                Como chegar
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-gray-500">
          Endereço não disponível
        </div>
      )}
    </div>
  );
};

// Componente para o accordion do endereço
const AddressAccordion = ({ clinic }: { clinic: UserWithServiceAndSubscription }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleMap = useCallback(() => {
    setIsMapOpen(prev => !prev);
  }, []);

  const hasAddress = Boolean(clinic.address);

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 w-full text-left"
        onClick={toggleMap}
        disabled={!hasAddress}
      >
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="flex-1 text-sm text-gray-700">
          {clinic.address || "Endereço não informado"}
        </span>
        {hasAddress && (
          isMapOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )
        )}
      </button>

      {/* Accordion Content - Google Maps */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isMapOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <GoogleMapsEmbed address={clinic.address || ''} isOpen={isMapOpen} />
      </div>
    </div>
  );
};

// Hook customizado para gerenciar horários
const useTimeSlots = (clinic: UserWithServiceAndSubscription, selectedDate: Date | undefined, selectedTime: string) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true);
    try {
      const dtString = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      ).toISOString().split("T")[0];
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dtString}`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar horários');
      }
      
      const json = await response.json();
      return Array.isArray(json) ? json : [];
    } catch (error) {
      console.error('Erro ao buscar horários bloqueados:', error);
      return [];
    } finally {
      setLoadingSlots(false);
    }
  }, [clinic.id]);

  useEffect(() => {
    if (!selectedDate) return;

    const processTimeSlots = async () => {
      const blocked = await fetchBlockedTimes(selectedDate);
      setBlockedTimes(blocked);

      const weekDayIndex = selectedDate.getUTCDay().toString();
      
      const clinicTimesFiltered = clinic.times
        .filter(time => time.startsWith(`${weekDayIndex}-`))
        .map(time => time.replace(`${weekDayIndex}-`, ''));

      const finalSlots = clinicTimesFiltered.map((time) => ({
        time,
        available: !blocked.includes(time)
      }));
      
      setAvailableTimeSlots(finalSlots);
    };

    processTimeSlots();
  }, [selectedDate, clinic.times, fetchBlockedTimes]);

  // Verificar se o horário selecionado ainda está disponível
  const isSelectedTimeStillAvailable = useMemo(() => {
    if (!selectedTime) return true;
    return availableTimeSlots.some(slot => slot.time === selectedTime && slot.available);
  }, [selectedTime, availableTimeSlots]);

  return {
    availableTimeSlots,
    blockedTimes,
    loadingSlots,
    isSelectedTimeStillAvailable
  };
};

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const router = useRouter();
  const form = useAppointmentForm();
  const { watch, setValue } = form;

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false);

  const { 
    availableTimeSlots, 
    blockedTimes, 
    loadingSlots, 
    isSelectedTimeStillAvailable 
  } = useTimeSlots(clinic, selectedDate, selectedTime);

  // Limpar horário selecionado se não estiver mais disponível
  useEffect(() => {
    if (!isSelectedTimeStillAvailable) {
      setSelectedTime("");
    }
  }, [isSelectedTimeStillAvailable]);

  // Calcular slots necessários baseado no serviço selecionado
  const requiredSlots = useMemo(() => {
    if (!selectedServiceId) return 1;
    const service = clinic.services.find(s => s.id === selectedServiceId);
    return service ? Math.ceil(service.duration / 30) : 1;
  }, [selectedServiceId, clinic.services]);

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const { name, email, phone, date } = form.getValues();
    return Boolean(name && email && phone && date && selectedTime && !isSubmitting);
  }, [form, selectedTime, isSubmitting]);

  const handleRegisterAppointment = useCallback(async (formData: AppointmentFormData) => {
    if (!selectedTime) {
      msgInfo("É necessário definir um horário para registro de agendamento.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createNewAppointment({
        name: formData.name,
        email: formData.email,
        cpf: extractFormatCPF(formData.cpf),
        phone: formData.phone,
        date: formData.date,
        clinicId: clinic.id,
        serviceId: formData.serviceId,
        time: selectedTime,
      });

      if (response.error) {
        msgError(response.error);
        return;
      }

      msgSuccess("Consulta agendada com sucesso.");
      form.reset();
      setSelectedTime("");
      router.refresh();
      
      // Reload após delay
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error) {
      msgError("Erro inesperado ao agendar consulta.");
      console.error('Erro no agendamento:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedTime, clinic.id, form, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header gradient */}
      <div className="h-32 bg-gradient-to-b from-white via-blue-100 to-indigo-200" />

      {/* Clinic info section */}
      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            {/* Clinic image */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8 shadow-lg">
              <Image
                src={clinic.image || imgTest}
                alt="Foto da clinica"
                className="object-cover"
                fill
                priority
              />
            </div>

            {/* Clinic name */}
            <h1 className="text-2xl font-bold mb-2 text-center">
              {capitalizeProperNames(clinic.name || '')}
            </h1>
            
            {/* Address with Google Maps Accordion */}
            <AddressAccordion clinic={clinic} />
          </article>
        </div>
      </section>

      {/* Appointment form section */}
      <section className="max-w-2xl mx-auto w-full mt-6 flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-lg"
          >
            {/* 👤 DADOS PESSOAIS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Dados Pessoais</h3>
              
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Nome completo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite seu nome completo..."
                        {...field}
                        onChange={(e) => {
                          const formattedValue = capitalizeProperNames(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CPF */}
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">CPF *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          onChange={(e) => {
                            const formattedValue = formatCPF(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data de Nascimento */}
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            field.onChange(date);
                          }}
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Endereço */}
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Endereço</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          placeholder="Rua, número, bairro, cidade"
                          className="flex-1"
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
                            >
                              <MapPin className="w-4 h-4" />
                              Buscar
                            </Button>
                          </DialogTrigger>
                          <AddressSelector
                            onAddressSelect={(address) => {
                              field.onChange(address);
                            }}
                            isOpen={isAddressSelectorOpen}
                            onOpenChange={setIsAddressSelectorOpen}
                          />
                        </Dialog>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 📞 CONTATOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contatos</h3>
              
              {/* Telefone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Telefone Principal *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="(85) 99999-9999"
                        maxLength={15}
                        onChange={(e) => {
                          const formattedValue = formatPhone(e.target.value);
                          field.onChange(formattedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 🏥 CONVÊNIO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Convênio (Opcional)</h3>
              
              {/* Nome do Convênio */}
              <FormField
                control={form.control}
                name="convenio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Nome do Convênio</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: Unimed, Hapvida, etc."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 🗓️ AGENDAMENTO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Agendamento</h3>

              {/* Serviço */}
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Defina o serviço *</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTime("");
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinic.services
                            .filter(service => service.status)
                            .map(service => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name} - {Math.floor(service.duration / 60)}h {service.duration % 60}min
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Data do agendamento *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        initialDate={new Date()}
                        className="pl-3 w-full rounded-lg border text-sm"
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date);
                            setSelectedTime("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Horários disponíveis */}
              {selectedServiceId && (
                <div className="pt-1">
                  <Label className="font-semibold pb-2">Horários disponíveis *</Label>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {loadingSlots ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span>Carregando horários...</span>
                      </div>
                    ) : availableTimeSlots.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        Nenhum horário disponível para esta data.
                      </p>
                    ) : (
                      <ScheduleTimeList
                        onSelectTime={setSelectedTime}
                        clinicTimes={clinic.times}
                        blockedTimes={blockedTimes}
                        availableTimeSlots={availableTimeSlots}
                        selectedTime={selectedTime}
                        selectedDate={selectedDate}
                        requiredSlots={requiredSlots}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3 pt-6 border-t">
              {clinic.status ? (
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50"
                  disabled={!isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Agendando...
                    </>
                  ) : (
                    <>
                      <CalendarArrowUp className="w-5 h-5 mr-2" />
                      Realizar agendamento
                    </>
                  )}
                </Button>
              ) : (
                <div className="bg-red-500 text-white text-center px-4 py-3 rounded-md flex-1">
                  A clínica está fechada no momento.
                </div>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setSelectedTime("");
                }}
                disabled={isSubmitting}
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
        </Form>
      </section>
    </div>
  );
}