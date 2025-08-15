// components/sidebar/SidebarDashboard.tsx
"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSidebarClasses, getMainClasses } from './utils/sidebar-styles'
import { SidebarDashboardProps } from './types/sidebar'

// Components
import { Logo } from './Logo'
import { CollapseButton } from './CollapseButton'
import { CollapsedNavigation } from './CollapsedNavigation'
import { ExpandedNavigation } from './ExpandedNavigation'
import { MobileHeader } from './MobileHeader'

export function SidebarDashboard({ children }: SidebarDashboardProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleCollapsed = () => setIsCollapsed(!isCollapsed)
  const handleMenuStateChange = () => setIsCollapsed(false)

  return (
    <div className='flex min-h-screen w-full'>
      {/* Desktop Sidebar */}
      <aside className={getSidebarClasses(isCollapsed)} role="complementary" aria-label="Sidebar de navegação">
        {/* Header with Logo and Collapse Button */}
        <div className='mb-6 mt-4 flex items-center justify-evenly font-bold text-2xl'>
          <Logo isCollapsed={isCollapsed} />
          <CollapseButton 
            isCollapsed={isCollapsed} 
            onToggle={toggleCollapsed} 
          />
        </div>

        {/* Navigation */}
        {isCollapsed ? (
          <CollapsedNavigation pathname={pathname} />
        ) : (
          <ExpandedNavigation pathname={pathname} />
        )}
      </aside>

      {/* Main Content Area */}
      <div className={getMainClasses(isCollapsed)}>
        {/* Mobile Header */}
        <MobileHeader 
          pathname={pathname} 
          onMenuStateChange={handleMenuStateChange} 
        />

        {/* Main Content */}
        <main className='flex-1 py-4 px-2 md:p-6' role="main">
          {children}
        </main>
      </div>
    </div>
  )
}