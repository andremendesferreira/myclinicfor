"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { UserRoundCog } from 'lucide-react'
import { ProfileFormData, useProfileForm } from './profile-form'
import { updateProfile } from '../_act/upd-profile'
import { msgSuccess, msgError } from '@/components/custom-toast'
import { formatPhone, extractFormatPhone } from '@/app/utils/formatPhone'
import { ProfileContentProps } from '../types/profile.types'

// Componentes refatorados
import { ProfileImage } from './profile-image'
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
    <div className='mx-auto'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardTitle className='flex items-center justify-self-auto'>
              <UserRoundCog className="ml-4 w-10 h-10 mr-4 text-emerald-500"/>
              <span className='text-3xl text-shadow-md lg:text-2xl'>Meu Perfil</span>
            </CardTitle>
            
            <CardContent className='space-y-6'>
              <ProfileImage imageUrl={user.image} />

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
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}