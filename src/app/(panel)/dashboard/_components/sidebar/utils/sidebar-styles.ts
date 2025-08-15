// utils/sidebar-styles.ts
import clsx from 'clsx'

export const getSidebarClasses = (isCollapsed: boolean) => clsx(
  "flex flex-col border-r bg-background transition-all duration-300 p-4 h-full",
  "bg-gradient-to-b from-white via-blue-100 to-indigo-200",
  {
    "w-20": isCollapsed,
    "w-64": !isCollapsed,
    "hidden md:flex md:fixed": true
  }
)

export const getMainClasses = (isCollapsed: boolean) => clsx(
  "flex flex-1 flex-col transition-all duration-300",
  {
    "md:ml-20": isCollapsed,
    "md:ml-64": !isCollapsed
  }
)

export const getSidebarLinkClasses = (pathname: string, href: string, isLogOut: boolean) => clsx(
  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
  {
    "text-white bg-blue-500": pathname === href && !isLogOut,
    "text-gray-700 hover:bg-white hover:text-blue-800": pathname !== href || isLogOut,
  }
)