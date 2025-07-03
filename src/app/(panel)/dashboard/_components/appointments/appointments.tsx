import { getAppointments } from '../../_dta/get-appontiments';
import { AppointmentsCalendar } from './appointment-calendar';

export async function Appointments({ userId }: { userId: string }) {

  const appointments = await getAppointments({ userId: userId, startDt: undefined, finalDt: undefined });

  return (
      <AppointmentsCalendar appointments={appointments}/>
  )
}