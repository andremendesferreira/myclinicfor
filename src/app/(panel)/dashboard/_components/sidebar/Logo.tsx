// components/sidebar/Logo.tsx
interface LogoProps {
  isCollapsed: boolean
}

export function Logo({ isCollapsed }: LogoProps) {
  if (isCollapsed) return null
  
  return (
    <span className="pb-2">
      <span className="text-blue-950">MyClinic</span>
      <span className="text-emerald-500">SOL</span>
    </span>
  )
}