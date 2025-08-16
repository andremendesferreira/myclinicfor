import Link from "next/link"
import { AlertTriangle, Banknote, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LabelSubscriptionProps {
  expired: boolean
  planName?: string
  limitType?: 'patients' | 'appointments' | 'storage'
}

export function LabelSubscription({ 
  expired, 
  planName = "seu plano atual",
  limitType = 'appointments'
}: LabelSubscriptionProps) {
  
  const getTitle = () => {
    if (expired) {
      return "Seu plano expirou!"
    }
    
    const limitMessages = {
      patients: "Limite de pacientes atingido",
      appointments: "Limite atingido", 
      storage: "Limite de armazenamento atingido"
    }
    
    return limitMessages[limitType]
  }

  const getDescription = () => {
    if (expired) {
      return `Para continuar usando o ${process.env.NEXT_PUBLIC_APP_NAME}, com todos os recursos, escolha um plano.`
    }

    return `Você atingiu um dos limites do seu atual plano. Sugerimos que realize um upgrade.`
  }

  const getStyles = () => {
    if (expired) {
      return {
        container: "bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500",
        icon: "text-red-600",
        badge: "bg-red-100 text-red-700 border border-red-300",
        text: "text-red-900"
      }
    }
    
    return {
      container: "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-500", 
      icon: "text-emerald-600",
      badge: "bg-blue-100 text-blue-700 border border-blue-300",
      text: "text-blue-900"
    }
  }

  const styles = getStyles()

  return (
    <div className={`${styles.container} rounded-lg p-4 md:p-5 my-4 shadow-lg`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Conteúdo Principal */}
        <div className="flex items-start gap-3 flex-1">
          {/* Ícone */}
          <div className={`${styles.icon} mt-0.5`}>
            {expired ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Banknote className="h-5 w-5" />
            )}
          </div>
          
          {/* Texto */}
          <div className="flex-1">
            <h3 className={`font-bold text-lg mb-1 ${styles.text}`}>
              {getTitle()}
              {/* Badge do plano */}
              {!expired && (
                <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 ${styles.badge} rounded-full text-xs font-medium`}>
                  <Star className="h-3 w-3 text-amber-400" />
                  {planName}
                </span>
              )}
            </h3>
            <p className={`text-sm md:text-base mb-2 ${styles.text} opacity-80`}>
              {getDescription()}
            </p>
            
          </div>
        </div>

        {/* Botão */}
        <div className="w-full md:w-auto md:flex-shrink-0">
          <Button asChild className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold transition-colors border border-gray-300">
            <Link href="/dashboard/plans" className="flex items-center justify-center gap-2">
              {expired ? "Escolher Plano" : "Fazer Upgrade"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}