"use client"
import { useState } from 'react'
import { ProfileFormData, useProfileForm } from './profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

import { Button } from '@/components/ui/button'
import { ArrowRight, UserRoundCog } from 'lucide-react'

import imgDef from '../../../../../../public/prof1.jpg'
import { cn } from '@/lib/utils'
import { Prisma } from '@/generated/prisma'
import { updateProfile } from '../_act/upd-profile'
import { msgSuccess, msgError, msgWarning, msgInfo } from './custom-toast'

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
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone
  });


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

    return hours;

  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
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
        phone: values.phone,
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
                          placeholder='Digite o telefone...'
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

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários de atendimento</DialogTitle>
                        <DialogDescription>
                          Selecione abaixo os horários de funcionamento:
                        </DialogDescription>
                      </DialogHeader>

                      <section className='py-4'>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Clique nos horários abaixo para marcar ou desmcar:
                        </p>

                        <div className='grid grid-cols-5 gap-2'>
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant="outline"
                              className={cn('h-10', selectedHours.includes(hour) && 'border-2 border-emerald-500 text-primary')}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>

                      </section >

                      <Button
                        className='w-full'
                        onClick={() => setDialogIsOpen(false)}
                      >
                        Fechar modal
                      </Button>

                    </DialogContent>
                  </Dialog>

                </div>


                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>
                        Selecione o fuso horário
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
                  Salvar alterações
                </Button>

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}