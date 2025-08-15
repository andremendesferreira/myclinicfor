// hooks/useSidebarLogout.ts
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

export function useSidebarLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.replace("/")
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return { handleLogout }
}