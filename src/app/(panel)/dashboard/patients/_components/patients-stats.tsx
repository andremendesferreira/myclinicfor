import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Calendar, TrendingUp } from "lucide-react"
import { getPatientsStats } from "../_dta/get-patients-stats"

interface PatientsStatsProps {
  userId: string
}

export async function PatientsStats({ userId }: PatientsStatsProps) {
  const stats = await getPatientsStats({ userId })

  const statsData = [
    {
      title: "Total de Pacientes",
      value: stats.total,
      icon: Users,
      change: "+12% este mês",
      changeType: "positive" as const
    },
    {
      title: "Pacientes Ativos",
      value: stats.active,
      icon: UserCheck,
      change: "Últimos 30 dias",
      changeType: "neutral" as const
    },
    {
      title: "Consultas Este Mês",
      value: stats.consultationsThisMonth,
      icon: Calendar,
      change: "+8% vs mês anterior",
      changeType: "positive" as const
    },
    {
      title: "Novos Pacientes",
      value: stats.newThisMonth,
      icon: TrendingUp,
      change: "Este mês",
      changeType: "neutral" as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}