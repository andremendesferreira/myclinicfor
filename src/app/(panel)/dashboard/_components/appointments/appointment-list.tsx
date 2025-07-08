"use client"

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Prisma } from '@/generated/prisma'
import { Button } from '@/components/ui/button'
import { X, Eye, CalendarClock } from 'lucide-react'
import { cancelAppointment } from '../../_act/cancel-appointment'
import {
  Dialog,
  DialogTrigger
} from '@/components/ui/dialog'
import { extractFormatPhone, formatPhone } from '@/app/utils/formatPhone'
import { DialogAppointment } from './dialog-appointment'
import { ButtonPickerAppointment } from './button-date'
import Link from 'next/link'
import { msgError, msgSuccess } from '@/components/custom-toast'

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true,
  }
}>

interface AppointmentsListProps {
  times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)


  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {

      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)

      const json = await response.json() as AppointmentWithService[];

      if (!response.ok) {
        return []
      }

      return json

    },
    staleTime: 10000, // 10 segundos
    refetchInterval: 60000, // 60 segundos
  })

  // Monta occupantMap slot > appointment
  // Se um Appointment começa no time (15:00) e tem requiredSlots 2
  // occupantMap["15:00", appoitment] occupantMap["15:30", appoitment] 
  const occupantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      // Calcular quantos slots necessarios ocupa
      const requiredSlots = Math.ceil(appointment.service.duration / 30);

      // Descobrir qual é o indice do nosso array de horarios esse agendamento começa.
      const startIndex = times.indexOf(appointment.time)

      // Se encontrou o index
      if (startIndex !== -1) {

        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;

          if (slotIndex < times.length) {
            occupantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }


  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId: appointmentId })

    if (response.error) {
      msgError(response.error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    await refetch()
    msgSuccess(response.data || 'Agendamento cancelado com sucesso.');

  }


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Card className="pt-3 gap-3">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pr-6 pb-0! mb-0!">
                  <CardTitle className="flex flex-row items-center justify-normal text-lg md:text-xl font-semibold">
                      <span className="pt-6">Agendamentos</span>
                      <CalendarClock className="w-6 h-6 text-emerald-600 ml-2" />
                  </CardTitle>
              </CardHeader>
              <CardContent className="m-0">  
          <ScrollArea className="h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-2 w-full flex-1">
            {isLoading ? (
              <p>Carregando agenda...</p>
            ) : (
              <>
                {times.map((slot) => {
                  const occupant = occupantMap[slot];
                  if (occupant) {
                    return (
                      <div
                        key={slot}
                        className='flex items-center py-2 border-t last:border-b'
                      >
                        <div className='w-16 text-sm font-semibold'>{slot}</div>

                        <div className='flex-1 text-sm'>
                          <div className='font-semibold'>{occupant.name}</div>
                          <div className='text-sm text-gray-500'>
                            <Link
                              href={`https://wa.me/${extractFormatPhone(occupant.phone, true)}?text=Olá%20${occupant.name.toString().split(' ')[0]}!%20Por%20favor,%20confirme%20sua%20presença%20na%20consulta%20agendada%20para%20${occupant.appointmentDate.toString().split('T')[0].split('-').reverse().join('/')}%20às%20${occupant.time}.%20Responda%20esta%20mensagem%20para%20confirmar.`}
                              target="_blank"
                              rel="Abrir WhatsApp"
                            >
                              {`💬${formatPhone(occupant.phone)}`}
                            </Link>
                          </div>
                        </div>

                        <div className='ml-auto'>
                          <div className='flex'>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDetailAppointment(occupant)}
                              >
                                <Eye className='w-4 h-4' />
                              </Button>
                            </DialogTrigger>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelAppointment(occupant.id)}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slot}
                      className='flex items-center py-2 border-t last:border-b'
                    >
                      <div className='w-16 text-sm font-semibold'>{slot}</div>
                      <div className='flex-1 text-sm'>
                        Disponível
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment
        appointment={detailAppointment}
      />
    </Dialog>
  )
}