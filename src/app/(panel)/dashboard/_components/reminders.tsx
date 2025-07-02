import { getReminders } from '../_dta/get-reminders';

export async function Reminders({ userId }: { userId: string }) {

  const reminders = await getReminders({ userId: userId })

  console.log("Lembretes encontrados: ", reminders)

  return (
    <div>
      <h1>LEMBRETES</h1>
    </div>
  )
}