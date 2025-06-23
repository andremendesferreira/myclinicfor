"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { Banknote, CalendarCheck2, ChevronLeft, ChevronRight, BriefcaseBusiness, Menu, LogOut, UserRoundCog, DoorOpen } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export function SidebarDashboard({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='flex min-h-screen w-full'>

      <aside
        className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
            "bg-gradient-to-b from-white via-blue-100 to-indigo-200", {
            "w-20": isCollapsed,
            "w-64": !isCollapsed,
            "hidden md:flex md:fixed": true
        })}
      >
        <div className='mb-6 mt-4 flex items-center justify-evenly font-bold text-2xl'>
          {!isCollapsed && (
              <span className="pb-2">
                  <span className="text-blue-950">MyClinic</span>
                  <span className="text-emerald-500">FOR</span>
              </span>
          )}
                <Button
                className='bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2'
                onClick={() => setIsCollapsed(!isCollapsed)}
                >
                {!isCollapsed ? <ChevronLeft className='w-12 h-12' /> : <ChevronRight className='w-12 h-12' />}
                </Button>
        </div>
        {/* Mostrar apenas quando a sidebar está recolhida */}
        {isCollapsed && (
          <nav className='flex flex-col gap-1 overflow-hidden mt-2'>
            <SidebarLink
              href="/dashboard"
              label="Agendamentos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<CalendarCheck2 className='w-6 h-6' />}
            />
            <SidebarLink
              href="/dashboard/services"
              label="Serviços"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<BriefcaseBusiness className='w-6 h-6' />}
            />
            <SidebarLink
              href="/dashboard/profile"
              label="Meu perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<UserRoundCog className='w-6 h-6' />}
            />

            <SidebarLink
              href="/dashboard/plans"
              label="Planos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Banknote className='w-6 h-6' />}
            />

            <SidebarLink
              href="/"
              label="Sair"
              pathname=""
              isCollapsed={isCollapsed}
              icon={<LogOut className='w-6 h-6' />}
            />
          </nav>
        )}


        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className='flex flex-col gap-1 overflow-hidden'>
              <span className='text-sm text-gray-400 font-medium mt-1 uppercase'>
                Painel
              </span>

              <SidebarLink
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className='w-6 h-6' />}
              />
              <SidebarLink
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<BriefcaseBusiness className='w-6 h-6' />}
              />

              <span className='text-sm text-gray-400 font-medium mt-1 uppercase'>
                Configurações
              </span>

              <SidebarLink
                href="/dashboard/profile"
                label="Meu perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<UserRoundCog className='w-6 h-6' />}
              />

              <SidebarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className='w-6 h-6' />}
              />

              <span className='text-sm text-gray-400 font-medium mt-1 uppercase'>
                ENCERRAR
              </span>

              <SidebarLink
                href="#sair"
                label="Sair"
                pathname=""
                isLogOut={true}
                isCollapsed={isCollapsed}
                icon={<DoorOpen className='w-full h-full' />}
              />

            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>

        <header
          className='md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0
          bg-linear-to-r from-white via-blue-200 to-indigo-200'
        >
          <Sheet>
            <div className='flex items-center gap-4'>
              <SheetTrigger asChild>
                <Button
                  variant="outline" size="icon" className='md:hidden bg-white hover:bg-blue-50 text-zinc-900'
                  onClick={() => setIsCollapsed(false)}
                >
                  <Menu className='w-5 h-5' />
                </Button>
              </SheetTrigger>

              <h1 className='text-base md:text-lg font-semibold'>
                <span className='font-semibold'>Menu </span><span className="text-blue-950 font-bold">MyClinic</span><span className="text-emerald-500 font-bold">FOR</span>
              </h1>
            </div>

            <SheetContent side="right" className='sm:max-w-xs text-black p-4 bg-gradient-to-b from-white via-blue-100 to-indigo-200'>
              <SheetTitle className="font-bold text-base"><span className="text-blue-950">MyClinic</span><span className="text-emerald-500">FOR</span>
                <SheetDescription>
                   <span className="font-normal text-sm">Menu administrativo</span>
                </SheetDescription>
              </SheetTitle>

              <nav className='grid gap-2 text-base pt-5'>
                <SidebarLink
                  href="/dashboard"
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<CalendarCheck2 className='w-6 h-6' />}
                />

                <SidebarLink
                  href="/dashboard/services"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<BriefcaseBusiness className='w-6 h-6' />}
                />

                <SidebarLink
                  href="/dashboard/profile"
                  label="Meu perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<UserRoundCog className='w-6 h-6' />}
                />

                <SidebarLink
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Banknote className='w-6 h-6' />}
                />


                <SidebarLink
                  href="#sair"
                  label="Sair"
                  pathname=""
                  isCollapsed={isCollapsed}
                  isLogOut={true}
                  icon={<DoorOpen className='w-6 h-6' />}
                />
              </nav>
            </SheetContent>
          </Sheet>

        </header>

        <main className='flex-1 py-4 px-2 md:p-6'>
          {children}
        </main>

      </div>

    </div>
  )
  
  async function LogOutSystem(){
    await signOut();
    router.replace("/");
  }

  interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
  isLogOut?: boolean | undefined;
}

  function SidebarLink({ href, icon, isCollapsed, label, pathname, isLogOut }: SidebarLinkProps) {
    return (
      <>
        { isLogOut === undefined ? (
      <Link
        href={href}
      >
        <div
          className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
            "text-white bg-blue-500": pathname === href,
            "text-gray-700 hover:bg-white hover:text-blue-800": pathname !== href,
          })}
        >
          <span className='w-6 h-6'>{icon}</span>
          {!isCollapsed && <span>{label}</span>}
        </div>
      </Link>
    ) : (
        <Button
          variant="ghost"
          size="lg"
          onClick={ async () => { await LogOutSystem() }}
          className="w-full h-full gap-2 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-white hover:text-blue-800"
        >
          <div className='flex items-center rounded-md w-full h-full p-0 m-0'>
            <span className='w-6 h-6 mr-2'><DoorOpen className="!w-6 !h-6" /></span>
            {!isCollapsed && <span className="text-base">{label}</span>}
          </div>
        </Button>
    )
  }
  </> )
  }
}