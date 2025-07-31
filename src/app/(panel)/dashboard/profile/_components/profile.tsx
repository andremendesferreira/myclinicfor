"use client"
import { useState } from 'react'
import { ProfileFormData, useProfileForm } from './profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import { ArrowRight, UserRoundCog } from 'lucide-react'

import imgDef from '../../../../../../public/prof1.jpg'
import { cn } from '@/lib/utils'
import { Prisma } from '@/generated/prisma'
import { updateProfile } from '../_act/upd-profile'
import { msgSuccess, msgError, msgWarning, msgInfo } from '@/components/custom-toast'
import { formatPhone, extractFormatPhone } from '@/app/utils/formatPhone';

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: formatPhone(user.phone || ''),
    status: user.status,
    timeZone: user.timeZone
  });

  // Dias da semana com seus respectivos identificadores
  const weekDays = [
    { id: 1, name: 'Segunda-feira', short: 'SEG' },
    { id: 2, name: 'Terça-feira', short: 'TER' },
    { id: 3, name: 'Quarta-feira', short: 'QUA' },
    { id: 4, name: 'Quinta-feira', short: 'QUI' },
    { id: 5, name: 'Sexta-feira', short: 'SEX' },
    { id: 6, name: 'Sábado', short: 'SAB' },
    { id: 0, name: 'Domingo', short: 'DOM' }
  ];

  function generateTimeSlots(): string[] {
    const hours: string[] = [];
    const v_i = 6;
    const l = 20;

    for (let i = v_i; i <= l; i++) {
      for (let j = 0; j < 2; j++) {
        if (i != l){
          const hour = i.toString().padStart(2, "0")
          const minute = (j * 30).toString().padStart(2, "0")
          hours.push(`${hour}:${minute}`)
        } else {
          j++
          const hour = i.toString().padStart(2, "0")
          const minute = (j * 0).toString().padStart(2, "0")
          hours.push(`${hour}:${minute}`)
        }
      }
    }

    return hours;}

  const hours = generateTimeSlots();

  function toggleHour(dayId: number, hour: string) {
    const timeSlot = `${dayId}-${hour}`;
    
    setSelectedHours((prev) => {
      if (prev.includes(timeSlot)) {
        return prev.filter(h => h !== timeSlot)
      } else {
        return [...prev, timeSlot].sort()
      }
    })
  }

  // Função para obter horários selecionados de um dia específico
  function getSelectedHoursForDay(dayId: number): string[] {
    return selectedHours
      .filter(timeSlot => timeSlot.startsWith(`${dayId}-`))
      .map(timeSlot => timeSlot.split('-')[1])
  }

  // Função para verificar se um horário está selecionado para um dia específico
  function isHourSelected(dayId: number, hour: string): boolean {
    return selectedHours.includes(`${dayId}-${hour}`)
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")
  );

  async function onSubmit(values: ProfileFormData) {
    try {

      const response = await updateProfile({
        name: values.name,
        address: values.address,
        phone: extractFormatPhone(values.phone ?? '') || '',
        status: values.status === 'active' ? true : false,
        timeZone: values.timeZone,
        times: selectedHours || []
      })

      if (response.error) {
          msgError(response.error)
        return;
      }
      
      msgSuccess(response.data || '')
  
      } catch(err) {
  
        if (err instanceof Error) {
          msgError(err.message)
        } else {
          msgError('Ocorreu um erro desconhecido')
        }
        return;

    }

  }


  return (
    <div className='mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
              <CardTitle className='flex items-center-safe justify-self-auto ' >
                <UserRoundCog className="ml-4 w-10 h-10 mr-4 text-emerald-500"/>
                <span className='text-3xl text-shadow-md lg:text-2xl'> Meu Perfil</span>
              </CardTitle>
            <CardContent className='space-y-6'>
              <div className='flex justify-center'>
                <div className='bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden'>
                  <Image
                    src={user.image ? user.image : imgDef}
                    alt="Foto da clinica"
                    fill
                    className='object-cover'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o nome da clinica...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Endereço completo:
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Digite o endereço da clinica...'
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
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='(99) 99999-9999'
                          onChange={ (e) => {
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Status da clinica
                      </FormLabel>
                      <FormControl>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clincia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">ATIVO (clinica aberta)</SelectItem>
                            <SelectItem value="inactive">INATIVO (clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>

                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className='space-y-2'>
                  <Label className='font-semibold'>
                    Configurar horários da clinica
                  </Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen} >
                    <DialogTrigger asChild>
                      <Button variant="outline" className='w-full justify-between'>
                        {user.times ? 'Clique aqui para modificar os horários' : 'Clique aqui para cadastrar horários' }
                        <ArrowRight className='w-5 h-5' />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Horários de atendimento por dia da semana</DialogTitle>
                        <DialogDescription>
                          Selecione os horários de funcionamento para cada dia da semana:
                        </DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="1" className="w-full">
                        <TabsList className="grid w-full grid-cols-7">
                          {weekDays.map((day) => (
                            <TabsTrigger key={day.id} value={day.id.toString()}>
                              {day.short}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {weekDays.map((day) => (
                          <TabsContent key={day.id} value={day.id.toString()}>
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">{day.name}</CardTitle>
                                <CardDescription>
                                  Horários selecionados: {getSelectedHoursForDay(day.id).length} 
                                  {getSelectedHoursForDay(day.id).length > 0 && 
                                    ` (${getSelectedHoursForDay(day.id).join(', ')})`
                                  }
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className='text-sm text-muted-foreground mb-3'>
                                  Clique nos horários abaixo para marcar ou desmarcar:
                                </p>

                                <div className='grid grid-cols-5 gap-2'>
                                  {hours.map((hour) => (
                                    <Button
                                      key={hour}
                                      type="button"
                                      variant="outline"
                                      className={cn(
                                        'h-10', 
                                        isHourSelected(day.id, hour) && 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                      )}
                                      onClick={() => toggleHour(day.id, hour)}
                                    >
                                      {hour}
                                    </Button>
                                  ))}
                                </div>

                                {getSelectedHoursForDay(day.id).length > 0 && (
                                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm font-medium text-gray-700">
                                      Horários selecionados para {day.name}:
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {getSelectedHoursForDay(day.id).join(' • ')}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>

                      <div className="flex gap-2 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className='flex-1'
                          onClick={() => {
                            // Limpar todos os horários selecionados
                            setSelectedHours([])
                          }}
                        >
                          Limpar Todos
                        </Button>
                        <Button
                          type="button"
                          className='flex-1 bg-emerald-600 hover:bg-emerald-500'
                          onClick={() => setDialogIsOpen(false)}
                        >
                          Salvar Horários
                        </Button>
                      </div>

                    </DialogContent>
                  </Dialog>

                </div>


                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Selecione o fuso horário
                      </FormLabel>
                      <FormControl>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className='w-full bg-emerald-600 hover:bg-emerald-500'
                >
                  Salvar alteração
                </Button>

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}