"use client"
import { useState, useEffect } from 'react'
//import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { UserRoundCog } from 'lucide-react'
import { ProfileFormData, useProfileForm } from './profile-form'
import { updateProfile } from '../_act/upd-profile'
import { msgSuccess, msgError } from '@/components/custom-toast'
import { formatPhone, extractFormatPhone } from '@/app/utils/formatPhone'
import { ProfileContentProps } from '../types/profile.types'
import { AvatarProfile } from './profile-avatar'

// Componentes refatorados
import { BasicInfoFields } from './profile-basic-info-fields'
import { StatusSwitch } from './profile-switch-status'
import { ActivitiesSelector } from './profile-activities'
import { ScheduleDialog } from './_schedule_dialog/schedule-dialog'
import { TimeZoneSelect } from './profile-timezone'

export function ProfileContent({ user, activities }: ProfileContentProps) {
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [selectedActivities, setSelectedActivities] = useState<string[]>(user.activities ?? [])

  const form = useProfileForm({
    name: user.name ?? '',
    address: user.address,
    phone: formatPhone(user.phone || ''),
    status: user.status,
    timeZone: user.timeZone,
    activities: user.activities || []
  });

  useEffect(() => {
    setSelectedHours(user.times || []);
    setSelectedActivities(user.activities || []);
  }, [user]);

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

  function toggleActivity(activityName: string) {
    setSelectedActivities((prev) => {
      if (prev.includes(activityName)) {
        return prev.filter(a => a !== activityName)
      } else {
        return [...prev, activityName].sort()
      }
    })
  }

  function clearAllHours() {
    setSelectedHours([]);
  }

  async function onSubmit(values: ProfileFormData) {
    try {
      const response = await updateProfile({
        name: values.name,
        address: values.address || '',
        phone: extractFormatPhone(values.phone ?? '') || '',
        status: values.status,
        timeZone: values.timeZone,
        times: selectedHours || [],
        activities: selectedActivities || []
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
    }
  }


  return (
    <div className="space-y-4">
      {/* Título e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Meu Perfil
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie as informações do seu perfil.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
              <AvatarProfile image={{
                imageUrl: user.image,
                alt: 'Imagem clinica'
              }} userId={user.id} />

              <div className='space-y-4'>
                <BasicInfoFields control={form.control} />
                
                <StatusSwitch control={form.control} />

                <ActivitiesSelector
                  activities={activities}
                  selectedActivities={selectedActivities}
                  onToggleActivity={toggleActivity}
                />

                <ScheduleDialog
                  hasExistingSchedule={!!user.times}
                  selectedHours={selectedHours}
                  onToggleHour={toggleHour}
                  onClearAllHours={clearAllHours}
                />

                <TimeZoneSelect control={form.control} />

                <Button
                  type="submit"
                  className='w-full bg-emerald-600 hover:bg-emerald-500 hover:shadow-sm hover:shadow-emerald-200 text-white font-semibold transition duration-300 px-6 py-3 rounded shadow'
                >
                  Salvar alteração
                </Button>
              </div>
        </form>
      </Form>
    </div>
  )
}