// components/sidebar/CollapsedNavigation.tsx
import { DoorOpen } from 'lucide-react'
import { SidebarLink } from './SidebarLink'
import { useSidebarLogout } from './hooks/useSidebarLogout'
import { MENU_SECTIONS } from './constants/menu-items'

interface CollapsedNavigationProps {
  pathname: string
}

export function CollapsedNavigation({ pathname }: CollapsedNavigationProps) {
  const { handleLogout } = useSidebarLogout()
  const allItems = MENU_SECTIONS.flatMap(section => section.items)

  return (
    <nav className='flex flex-col gap-1 overflow-hidden mt-2' role="navigation" aria-label="Menu principal">
      {allItems.map((item) => (
        <SidebarLink
          key={item.href}
          {...item}
          pathname={pathname}
          isCollapsed={true}
        />
      ))}
      <SidebarLink
        href="#sair"
        label="Sair"
        pathname=""
        isCollapsed={true}
        isLogOut={true}
        icon={<DoorOpen className='w-6 h-6' />}
        onClick={handleLogout}
      />
    </nav>
  )
}