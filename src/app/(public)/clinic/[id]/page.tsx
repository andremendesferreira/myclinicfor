import { redirect } from 'next/navigation';
import { getInfoSchedule } from './_dta/get-info-schedule';
import { ScheduleContent } from './_components/schedule-content'

export default async function SchedulePage({
        params, 
    }: {
        params: Promise<{ id: string }>
}){

    const userId = (await  params).id;
    const user = await getInfoSchedule({userId: userId });

    // Verifica se existe usuário e ele possuí as propriedade requeridas
    if (
        !user ||
        typeof user !== 'object' ||
        !('subscription' in user) ||
        !('services' in user)
    ) {
        redirect("/");
    }

    // console.log(user);
    return (
        <ScheduleContent clinic={user} />
    )
}