// components/sidebar/MobileHeader.tsx
import { useState } from 'react'
import { Menu, DoorOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarLink } from './SidebarLink'
import { useSidebarLogout } from './hooks/useSidebarLogout'
import { MENU_SECTIONS } from './constants/menu-items'

interface MobileHeaderProps {
  pathname: string
  onMenuStateChange: () => void
}

export function MobileHeader({ pathname, onMenuStateChange }: MobileHeaderProps) {
  const { handleLogout } = useSidebarLogout()
  const [isOpen, setIsOpen] = useState(false)
  const allItems = MENU_SECTIONS.flatMap(section => section.items)

  const handleLinkClick = () => {
    setIsOpen(false) // Fecha o sheet quando um link é clicado
  }

  const handleLogoutClick = async () => {
    setIsOpen(false) // Fecha o sheet antes de fazer logout
    await handleLogout()
  }

  return (
    <header className='md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-gradient-to-r from-white via-blue-200 to-indigo-200'>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center gap-4'>
          <SheetTrigger asChild>
            <Button
              variant="outline" 
              size="icon" 
              className='md:hidden bg-white hover:bg-blue-50 text-zinc-900 cursor-pointer'
              onClick={() => {
                setIsOpen(true)
                onMenuStateChange()
              }}
              aria-label="Abrir menu"
            >
              <Menu className='w-5 h-5' />
            </Button>
          </SheetTrigger>

          <h1 className='text-base md:text-lg font-semibold'>
            <span className='font-semibold'>Menu </span>
            <span className="text-blue-950 font-bold">MyClinic</span>
            <span className="text-emerald-500 font-bold">SOL</span>
          </h1>
        </div>

        <SheetContent 
          side="right" 
          className='sm:max-w-xs text-black p-4 bg-gradient-to-b from-white via-blue-100 to-indigo-200'
        >
          <SheetHeader>
            <SheetTitle className="font-bold text-base">
              <span className="text-blue-950">MyClinic</span>
              <span className="text-emerald-500">SOL</span>
            </SheetTitle>
            <SheetDescription>
              <span className="font-normal text-sm">Menu administrativo</span>
            </SheetDescription>
          </SheetHeader>

          <nav className='grid gap-2 text-base pt-5' role="navigation" aria-label="Menu mobile">
            {allItems.map((item) => (
              <div key={item.href} onClick={handleLinkClick}>
                <SidebarLink
                  {...item}
                  pathname={pathname}
                  isCollapsed={false}
                />
              </div>
            ))}
            <SidebarLink
              href="#sair"
              label="Sair"
              pathname=""
              isCollapsed={false}
              isLogOut={true}
              icon={<DoorOpen className='w-6 h-6' />}
              onClick={handleLogoutClick}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}