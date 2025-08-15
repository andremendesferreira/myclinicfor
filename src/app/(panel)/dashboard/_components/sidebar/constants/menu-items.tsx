// constants/menu-items.tsx
import {
  Banknote,
  CalendarCheck2,
  BriefcaseBusiness,
  UserRoundCog,
  Users,
  FileText
} from 'lucide-react'
import { MenuSection } from '../types/sidebar'

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Painel",
    items: [
      {
        href: "/dashboard",
        label: "Agendamentos",
        icon: <CalendarCheck2 className='w-6 h-6' />
      },
      {
        href: "/dashboard/patients",
        label: "Pacientes",
        icon: <Users className='w-6 h-6' />
      },
      {
        href: "/dashboard/consultations",
        label: "Consultas",
        icon: <FileText className='w-6 h-6' />
      },
      {
        href: "/dashboard/services",
        label: "Serviços",
        icon: <BriefcaseBusiness className='w-6 h-6' />
      }
    ]
  },
  {
    title: "Configurações",
    items: [
      {
        href: "/dashboard/profile",
        label: "Meu perfil",
        icon: <UserRoundCog className='w-6 h-6' />
      },
      {
        href: "/dashboard/plans",
        label: "Planos",
        icon: <Banknote className='w-6 h-6' />
      }
    ]
  }
]