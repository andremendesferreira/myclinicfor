// components/sidebar/SidebarLink.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSidebarLinkClasses } from './utils/sidebar-styles'
import { SidebarLinkProps } from './types/sidebar'

export function SidebarLink({ 
  href, 
  icon, 
  isCollapsed, 
  label, 
  pathname, 
  isLogOut = false,
  onClick 
}: SidebarLinkProps) {
  const handleClick = async () => {
    if (onClick) {
      await onClick()
    }
  }

  const linkClasses = getSidebarLinkClasses(pathname, href, isLogOut)

  if (isLogOut) {
    return (
      <Button
        variant="ghost"
        size="lg"
        onClick={handleClick}
        className="w-full h-auto justify-start gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 hover:bg-white hover:text-blue-800 cursor-pointer"
      >
        <div className='w-6 h-6 flex items-center justify-center flex-shrink-0'>
          {icon}
        </div>
        {!isCollapsed && <span className="text-base font-normal">{label}</span>}
      </Button>
    )
  }

  return (
    <Link href={href}>
      <div className={linkClasses}>
        <div className='w-6 h-6 flex items-center justify-center flex-shrink-0'>
          {icon}
        </div>
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  )
}