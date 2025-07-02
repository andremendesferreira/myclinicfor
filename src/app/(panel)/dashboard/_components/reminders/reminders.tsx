import { getReminders } from '../../_dta/get-reminders';
import { ReminderList } from './reminder-list';

export async function Reminders({ userId }: { userId: string }) {

  const reminders = await getReminders({ userId: userId })

  return (
    <div>
      <ReminderList reminder={reminders}/>
    </div>
  )
}