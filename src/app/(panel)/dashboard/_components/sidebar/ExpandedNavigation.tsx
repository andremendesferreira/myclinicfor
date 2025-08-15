// components/sidebar/ExpandedNavigation.tsx
import { DoorOpen } from 'lucide-react'
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { SidebarLink } from './SidebarLink'
import { useSidebarLogout } from './hooks/useSidebarLogout'
import { MENU_SECTIONS } from './constants/menu-items'

interface ExpandedNavigationProps {
  pathname: string
}

export function ExpandedNavigation({ pathname }: ExpandedNavigationProps) {
  const { handleLogout } = useSidebarLogout()

  return (
    <Collapsible open={true}>
      <CollapsibleContent>
        <nav className='flex flex-col gap-1 overflow-hidden' role="navigation" aria-label="Menu principal">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title}>
              <span className='text-sm text-gray-400 font-medium mt-4 mb-2 uppercase first:mt-1'>
                {section.title}
              </span>
              {section.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  isCollapsed={false}
                />
              ))}
            </div>
          ))}
          
          <span className='text-sm text-gray-400 font-medium mt-4 mb-2 uppercase'>
            Encerrar
          </span>
          <SidebarLink
            href="#sair"
            label="Sair"
            pathname=""
            isLogOut={true}
            isCollapsed={false}
            icon={<DoorOpen className='w-6 h-6' />}
            onClick={handleLogout}
          />
        </nav>
      </CollapsibleContent>
    </Collapsible>
  )
}