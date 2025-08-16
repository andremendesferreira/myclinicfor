import { Suspense } from "react"
import { LifeLine } from "react-loading-indicators"
import getSession from "@/lib/getSession"
import { redirect } from "next/navigation"
import { verifyPermission } from "@/app/utils/permissions/verify-permission"
import { LabelSubscription } from "@/components/label-subscription"
import { PatientsHeader } from "./_components/patients-header"
import { PatientsList } from "./_components/patients-list"
import { PatientsStats } from "./_components/patients-stats"
import { getPatients } from "./_dta/get-patients"

export default async function PatientsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const permission: any = await verifyPermission({ type: "service" })

  return (
    <main className="space-y-6">
      {/* Alerta de permissão */}
      {!permission.hasPermission && (
        <LabelSubscription 
          expired={permission.expired} 
          planName={permission?.plan?.name}
          limitType="patients"
        />
      )}

      {/* Header da página */}
      <PatientsHeader hasPermission={permission.hasPermission} />

      {/* Estatísticas */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-32">
          <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        </div>
      }>
        <PatientsStats userId={session.user?.id!} />
      </Suspense>

      {/* Lista de pacientes */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        </div>
      }>
        <PatientsListWrapper userId={session.user?.id!} />
      </Suspense>
    </main>
  )
}

// Wrapper para buscar os dados dos pacientes
async function PatientsListWrapper({ userId }: { userId: string }) {
  const patients = await getPatients({ userId })
  return <PatientsList patients={patients} />
}