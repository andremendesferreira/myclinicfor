"use client"
import { Prisma } from '@/generated/prisma';
import { 
    Card,
    CardContent,
    CardTitle,
    CardHeader
 } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock } from 'lucide-react';
// import { ptBR } from "date-fns/locale";
// registerLicense("Ngo9BigBOggjHTQxAR8/V1JEaF5cXmtCdkx1WmFZfVtgdl9EaVZRRGY/P1ZhSXxWdkJjXX5adHRVRWBdUkZ9XEI=");
import './style/scheduler.css';


type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true
  }
}>

interface AppointmentsListProps {
    appointments: AppointmentWithService[]
}

export function AppointmentsCalendar({ appointments }: AppointmentsListProps){

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      // fetching data
      setIsLoading(false);
    }, []);

    // Função para aplicar os cálculos nos elementos
    function convertAppointment(date: Date, time: string, duration: number ){
      const convertTime = date.toISOString().split("T")[0];
      const [ year, month, day ] = convertTime.split("-").map(Number);
      const [ hour, min ] = time.split(":").map(Number);
      const hUsed = Math.floor(duration / 60);
      const mUsed = Math.floor(duration % 60);
      
      // FIX: JavaScript months são 0-indexed
      const addSelectedTime = new Date(Date.UTC(year, month - 1, day, hour, min, 0));
      const addFinalTime = new Date(Date.UTC(year, month - 1, day, hour + hUsed, min + mUsed, 0));
      
      const formatedDate = {
        startDt: addSelectedTime,
        finalDt: addFinalTime
      }
      
      return formatedDate
    }

    function curretDate(){
      const agora = new Date();
      const year = agora.getFullYear();
      const month = agora.getMonth();
      const day = agora.getDate();
      return new Date(Date.UTC(year, month, day, 0 , 0, 0, 0 ));
    }

    // Eventos dos appointments
    const events = appointments.map((appointment) => {
        const startTime = new Date(convertAppointment(appointment.appointmentDate, appointment.time, appointment.service.duration).startDt);
        const formattedTime = startTime.toLocaleString('pt', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return {
            TaskID: appointment.id,
            OwnerID: appointment.userId,
            Description: appointment.service.name,
            Title: appointment.name,
            Start: formattedTime,
            timeZoneNames: 'America_Fortaleza',
            End: new Date(convertAppointment(appointment.appointmentDate, appointment.time, appointment.service.duration).finalDt),
            EndTimezone: 'America_Fortaleza',
            RecurrenceRule: null,
            RecurrenceID: null,
            RecurrenceException: null,
            isAllDay: false,
        };
    });

    // Combinar todos os eventos
    const allEvents = [...events];
    // console.log(allEvents)

    return(
        <div className="flex flex-col">
          <Card className="pt-3 gap-3">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pr-6 pb-0! mb-0!">
                  <CardTitle className="flex flex-row items-center justify-normal text-lg md:text-xl font-semibold">
                      <span className="pt-6">Agendamentos</span>
                      <CalendarClock className="w-6 h-6 text-emerald-600 ml-2" />
                  </CardTitle>
              </CardHeader>
              <CardContent className="m-0">  
                <ScrollArea className="h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
                  <div className="mr-4">
                  </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
    )
}