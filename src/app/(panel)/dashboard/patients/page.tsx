import { Suspense } from "react"
import { LifeLine } from "react-loading-indicators"
import getSession from "@/lib/getSession"
import { redirect } from "next/navigation"
import { verifyPermission } from "@/app/utils/permissions/verify-permission"
import { LabelSubscription } from "@/components/label-subscription"
import { PatientsHeaderSimple } from "./_components/patients-header-simple"
import { PatientsListClientWrapper } from "./_components/patients-list-client-wrapper"
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

      {/* ✅ 1º - Header da página (só título + botão) */}
      <PatientsHeaderSimple hasPermission={permission.hasPermission} />

      {/* ✅ 2º - Estatísticas (posição original) */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-32">
          <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        </div>
      }>
        <PatientsStats userId={session.user?.id!} />
      </Suspense>

      {/* ✅ 3º - Lista de pacientes (com pesquisa integrada) */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        </div>
      }>
        <PatientsListWrapper 
          userId={session.user?.id!} 
          hasPermission={permission.hasPermission}
        />
      </Suspense>
    </main>
  )
}

// Server Component que busca os dados iniciais
async function PatientsListWrapper({ 
  userId, 
  hasPermission 
}: { 
  userId: string
  hasPermission: boolean 
}) {
  const patients = await getPatients({ userId })
  
  return (
    <PatientsListClientWrapper 
      initialPatients={patients} 
      userId={userId}
      hasPermission={hasPermission}
    />
  )
}