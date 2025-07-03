"use client"
import { Appointment } from '@/generated/prisma';
import { Scheduler } from "@aldabil/react-scheduler";
import { 
    Card,
    CardContent,
    CardTitle,
    CardHeader

 } from "@/components/ui/card";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarClock } from 'lucide-react';
import { ptBR } from "date-fns/locale";

interface AppointmentsListProps {
    appointments: Appointment[]
}

const translations = {
  navigation: {
    month: "Mês",
    week: "Semana",
    day: "Dia",
    today: "Hoje",
    agenda: "Agenda"
  },
  form: {
    addTitle: "Adicionar evento",
    editTitle: "Editar evento",
    confirm: "Confirmar",
    delete: "Excluir",
    cancel: "Cancelar",
    addSubtitle: "Adicionar novo evento",
    editSubtitle: "Editar evento",
    datePickerTitle: "Escolher data",
    datePickerSubtitle: "Escolher data e hora",
    datePickerCancel: "Cancelar",
    datePickerConfirm: "Confirmar",
    datePickerPrevHour: "Hora anterior",
    datePickerNextHour: "Próxima hora",
    datePickerPrevDay: "Dia anterior",
    datePickerNextDay: "Próximo dia",
    datePickerPrevMonth: "Mês anterior",
    datePickerNextMonth: "Próximo mês",
    datePickerPrevYear: "Ano anterior",
    datePickerNextYear: "Próximo ano",
    deleteButton: "Excluir",
    saveButton: "Salvar",
    cancelButton: "Cancelar",
    multipleResourcesTitle: "Selecionar recursos",
    multipleResourcesSubtitle: "Selecionar múltiplos recursos",
    multipleResourcesConfirm: "Confirmar",
    multipleResourcesCancel: "Cancelar"
  },
  event: {
    title: "Título",
    start: "Início",
    end: "Fim",
    allDay: "Dia inteiro",
    description: "Descrição",
    subtitle: "Subtítulo",
    bgColor: "Cor de fundo",
    textColor: "Cor do texto",
    editable: "Editável",
    draggable: "Arrastável",
    deletable: "Excluível",
    admin_id: "ID do administrador",
    resource_id: "ID do recurso",
    resourceId: "ID do recurso",
    resourceTitle: "Título do recurso"
  },
  validation: {
    required: "Campo obrigatório",
    invalidEmail: "Email inválido",
    invalidDate: "Data inválida",
    invalidTime: "Hora inválida",
    invalidUrl: "URL inválida",
    min: "Valor mínimo: {min}",
    max: "Valor máximo: {max}",
    minLength: "Tamanho mínimo: {min} caracteres",
    maxLength: "Tamanho máximo: {max} caracteres"
  },
  moreEvents: "+ {count} mais",
  noDataToDisplay: "Nenhum dado para exibir",
  loading: "Carregando...",
  confirmation: {
    deleteTitle: "Confirmar exclusão",
    deleteMessage: "Tem certeza que deseja excluir este evento?",
    deleteConfirm: "Sim, excluir",
    deleteCancel: "Cancelar"
  },
  buttons: {
    prev: "Anterior",
    next: "Próximo",
    today: "Hoje",
    month: "Mês",
    week: "Semana",
    day: "Dia",
    agenda: "Agenda"
  },
  toolbar: {
    searchPlaceholder: "Pesquisar eventos...",
    showWeekends: "Mostrar fins de semana",
    showAllDay: "Mostrar eventos de dia inteiro"
  },
  agenda: {
    date: "Data",
    time: "Hora",
    event: "Evento",
    noEvents: "Nenhum evento encontrado"
  },
  months: {
    january: "Janeiro",
    february: "Fevereiro",
    march: "Março",
    april: "Abril",
    may: "Maio",
    june: "Junho",
    july: "Julho",
    august: "Agosto",
    september: "Setembro",
    october: "Outubro",
    november: "Novembro",
    december: "Dezembro"
  },
  weekDays: {
    sunday: "Domingo",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado"
  },
  weekDaysShort: {
    sunday: "Dom",
    monday: "Seg",
    tuesday: "Ter",
    wednesday: "Qua",
    thursday: "Qui",
    friday: "Sex",
    saturday: "Sáb"
  }
};


export function AppointmentsCalendar({appointments}: AppointmentsListProps){

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);

      // fetching data
      
      setIsLoading(false);
    }, []);

    console.log('Listar agendamentos: ', appointments);
    return(
        <div className="flex flex-col">
          <Card className="pt-3 gap-3">
              <CardHeader className="flex flex-row items-center justify-between pl-6 pr-6 pb-0! mb-0!">
                  <CardTitle className="flex flex-row items-center justify-normal text-lg md:text-xl font-semibold">
                      <span className="pt-6">Agendamentos</span>
                      <CalendarClock className="w-6 h-6 text-emerald-600" />
                  </CardTitle>
              </CardHeader>
              <CardContent className="m-0">  
                <ScrollArea className="h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
                  <div className="mr-4">
                    <Scheduler
                      view='day'
                      agenda={false}
                      editable={false}
                      draggable={false}
                      deletable={false}
                      height={570}
                      locale={ptBR}
                      translations={translations}
                      events={appointments.map((appointment) => ({
                        event_id: appointment.id,
                        title: appointment.name,
                        start: new Date(appointment.appointmentDate),
                        end: new Date(appointment.appointmentDate + appointment.time), // Adjust as needed for end time
                      }))}
                    />
                  </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
    )
}