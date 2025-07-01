import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "./profile/_dta/get_info_user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarArrowUp } from "lucide-react";
import { ButtonCopyLink } from './_components/button-copy-link';

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
    <main>
      <div className='space-x-2 flex items-center justify-end'>
        <Link 
          href={`/clinic/${session.user?.id}`}
          target='_blank'
        >
          <Button className='bg-emerald-600 hover:bg-emerald-500 flex-1 md:flex[0]'>
            <CalendarArrowUp className='w-5! h-5!' />
            <span>Novo agendamento</span>
          </Button>
        </Link>
        <ButtonCopyLink      
          url={urlLink}
          msgErr="Falha ao tentar copiar link de referência da clínica."
          msgInf="Link de referência copiado para área de transferência."
          styleBt="bg-blue-900 hover:bg-blue-700"
        />
      </div>
    </main>
  );
}