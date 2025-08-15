// types/sidebar.ts
export interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  pathname: string
  isCollapsed: boolean
  isLogOut?: boolean
  onClick?: () => void
}

export interface MenuSection {
  title: string
  items: Omit<SidebarLinkProps, 'pathname' | 'isCollapsed'>[]
}

export interface SidebarDashboardProps {
  children: React.ReactNode
}