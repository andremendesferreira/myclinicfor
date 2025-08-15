// components/sidebar/CollapseButton.tsx
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CollapseButtonProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function CollapseButton({ isCollapsed, onToggle }: CollapseButtonProps) {
  return (
    <Button
      className='bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2 cursor-pointer'
      onClick={onToggle}
      aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
    >
      {isCollapsed ? 
        <ChevronRight className='w-12 h-12' /> : 
        <ChevronLeft className='w-12 h-12' />
      }
    </Button>
  )
}