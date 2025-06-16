"use client"
import { useProfileForm } from './profile-form'
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
import { UserRoundCog } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import imgTest from '../../../../../../public/prof1.jpg'

export function ProfileContent() {

  const form = useProfileForm();


  return (
    <div className='mx-auto'>
      <Form {...form}>
        <form>
          <Card>
            <CardHeader >
              <CardTitle className='flex items-center-safe justify-self-auto ' >
                <UserRoundCog className="w-12 h-12 mr-4 text-emerald-500"/>
                <span className='text-4xl text-shadow-md lg:text-3xl'> Meu Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex justify-center'>
                <div className='bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden'>
                  <Image
                    src={imgTest}
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
                            <SelectItem value="active">Ativo (clinica aberta)</SelectItem>
                            <SelectItem value="inactive">Inativo (clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>

                      </FormControl>
                    </FormItem>
                  )}
                />

              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}