"use client"

import { useState, useCallback, useEffect } from 'react'
import Image from "next/image"
import imgTest from '../../../../../../public/prof1.jpg'
import { CalendarArrowUp, MapPin } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { useAppointmentForm, AppointmentFormData } from './schedule-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatPhone } from '@/app/utils/formatPhone'
import { DateTimePicker } from "./date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScheduleTimeList } from './schedule-time-list'
import { msgError, msgInfo, msgSuccess, msgWarning } from '@/components/custom-toast'
import { createNewAppointment } from '../_act/create-appointment'
import { useRouter } from 'next/navigation'


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

export function ScheduleContent({ clinic }: ScheduleContentProps) {

  const router = useRouter();
  const form = useAppointmentForm();
  const { watch } = form;

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");

  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Quais os horários bloqueados 01/02/2025 > ["15:00", "18:00"]
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])

  // Função que busca os horários bloqueados (via Fetch HTTP)

    const fetchBlockedTimes = useCallback( async (date: Date): Promise<string[]> => {
      setLoadingSlots(true);
      try{
        // console.log(date.toISOString().split("T")[0])
        const dtString = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())).toISOString().split("T")[0];
        const urlFetch = `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dtString}`
        const response = await fetch(urlFetch);

        const json = await response.json();
        setLoadingSlots(false);
        return json;

      }catch(err){
        console.log(err);
        setLoadingSlots(false);
        return [];
      }
  }, [clinic.id])

  useEffect(()=>{
    // console.log('Dia selecionado: ', selectedDate)
    if (selectedDate){
      fetchBlockedTimes(
        new Date(
          Date.UTC(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
          )
        )
      ).then((blocked) => {
        // console.log("Horários reservados: ", blocked)
        setBlockedTimes(blocked);

        const times = clinic.times || [];
        const finalSlot = times.map((time) => ({
          time: time,
          available: !blocked.includes(time)
        }))
        
        setAvailableTimeSlots(finalSlot);

        // Verificar se o slot estiver disponível, limpar a seleção
        const stillAvailable = finalSlot.find(
          (slot) => slot.time === selectedTime && slot.available
        )
        
        if(!stillAvailable){
          setSelectedTime("");
        }
      })
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointmnent(formData: AppointmentFormData) {
    if(!selectedTime){
      msgInfo("É necessário definir um horário para registro de agendamento.")
      return;
    }
    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      clinicId: clinic.id,
      serviceId: formData.serviceId,
      time: selectedTime,
    })

    if(response.error){
      msgError(response.error)
      return;
    }

    msgSuccess("Consulta agendada com sucesso.");
    form.reset();
    setSelectedTime("");

    router.refresh();
    
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-gradient-to-b from-white via-blue-100 to-indigo-200 " />

      <section className="contianer mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image
                src={clinic.image ? clinic.image : imgTest}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              {clinic.name}
            </h1>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não informado"}
              </span>
            </div>
          </article>

        </div>
      </section>


      <section className="max-w-2xl mx-auto w-full mt-6 flex-1">
        {/* Formulário de agendamento */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegisterAppointmnent)}
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-lg"
          >

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Nome completo:</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Digite seu nome completo..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="Digite seu email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder="(XX) XXXXX-XXXX"
                      onChange={(e) => {
                        const formattedValue = formatPhone(e.target.value)
                        field.onChange(formattedValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">Defina o serviço:</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value:any) => {
                      field.onChange(value)
                      setSelectedTime("")
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map((service) => (
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="mb-3! gap-0">
                  <FormLabel className="font-semibold mb-2">Data do agendamento:</FormLabel>
                  <FormControl className="pt-2">
                    <DateTimePicker
                      initialDate={new Date()}
                      className="pl-3 w-full rounded-lg border m-0! text-sm"
                      onChange={(date) => {
                        // console.log('VerDate: ', date)
                        if (date) {
                          field.onChange(date)
                          setSelectedTime("")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="pt-1">
                <Label className='font-semibold pb-2'>Horários disponíveis:</Label>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ): availableTimeSlots.length === 0 ? (
                    <p>Nenhum horário disponível.</p>
                  ): (
                    <ScheduleTimeList
                      onSelectTime={(time) => setSelectedTime(time)}
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTimes}
                      availableTimeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.services.find(service => service.id === selectedServiceId) ? 
                        Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 30)
                        : 1
                      }
                    />
                  )}
                </div>
              </div>
            )}


            {clinic.status ? (
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("date")}
              >
                <CalendarArrowUp className="w-5! h-5!" />
                Realizar agendamento
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                A clinica está fechada nesse momento.
              </p>
            )}

          </form>
        </Form>
      </section>

    </div>
  )
}