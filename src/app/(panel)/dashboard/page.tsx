import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "./profile/_dta/get_info_user";
import Link from "next/link";
import { CalendarArrowUp } from "lucide-react";
import { ButtonCopyLink } from './_components/button-copy-link';
import { Reminders } from './_components/reminders/reminders';
import { ButtonTooltipCustom } from './_components/button-tooltip';
import { Appointments } from './_components/appointments/appointments'
import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";

export default async function Dashboard(){
  const session = await getSession();

    if(!session){
      redirect("/");
    }

  const user = await getUserData({ userId: session.user?.id })
  
  if (!user) {
    redirect("/")
  }

  const urlLink = `${process.env.NEXT_PUBLIC_URL}/clinic/${user.id}`

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
        <LifeLine color="#3191cc" size="medium" text="" textColor="" />
      </div>
    }>
      <main>
        <div className='space-x-2 flex items-center justify-end'>
          <Link 
            href={`/clinic/${session.user?.id}`}
            target='_blank'
          >
            <ButtonTooltipCustom 
              className='bg-emerald-600 hover:bg-emerald-500 flex-1 md:flex[0] cursor-pointer'
              icon={<CalendarArrowUp className="w-5! h-5!"/>}
              textButtonInner="Novo agendamento"
              tooltipMsg="Abrir página de agendamento em nova guia."
              tooltipStyleBox="bg-emerald-600 text-white fill-emerald-600"
              tooltipStyleArrow="bg-emerald-600"
            />
          </Link>
          <ButtonCopyLink      
            url={urlLink}
            msgErr="Falha ao tentar copiar link de referência da clínica."
            msgInf="Link de referência copiado para área de transferência."
            styleBt="bg-blue-900 hover:bg-blue-700"
            tooltipMsg="Copiar link da página de agendamento."
            tooltipStyleBx="bg-blue-800 text-white fill-blue-800"
            tooltipStyleAw="bg-blue-800"
          />
        </div>

        <section className="grid grid-col-1 gap-4 lg:grid-cols-2 mt-4">
          <Appointments userId={session.user?.id!} />
          <Reminders userId={session.user?.id!} />
        </section>
      </main>
    </Suspense>
  );
}