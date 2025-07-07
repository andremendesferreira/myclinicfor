//import { getAppointments } from '../../_dta/get-appontiments';
//import { AppointmentsCalendar } from './appointment-calendar';
import { getTimesClinic } from '../../_dta/get-times-clinic'
import { AppointmentsList } from './appointment-list'

export async function Appointments({ userId }: { userId: string }) {

  //const appointments = await getAppointments({ userId: userId, startDt: undefined, finalDt: undefined });
  const { times } = await getTimesClinic({ userId: userId })

  return (
      <AppointmentsList times={times}/>
  )
}