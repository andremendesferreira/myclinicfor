// ================================================================
// 👤 PATIENT CARD - Componente Individual de Paciente
// ================================================================
// Arquivo: src/app/(panel)/dashboard/patients/_components/_patient/patient-card.tsx

"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Phone, Mail, Eye, Edit, EyeOff, Loader2 } from "lucide-react"
import { formatCPF, formatPhone } from "@/lib/validations"

interface Patient {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco?: string
  convenio?: string
  status: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    consultations: number
  }
}

interface PatientCardProps {
  patient: Patient
  onView: (patient: Patient) => void
  onEdit: (patient: Patient) => void
  onToggleStatus: (patient: Patient) => void
  isLoading?: boolean
}

export function PatientCard({ 
  patient, 
  onView, 
  onEdit, 
  onToggleStatus, 
  isLoading = false 
}: PatientCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleMenuClick = () => {
    setShowMenu(!showMenu)
  }

  const handleAction = (action: () => void) => {
    setShowMenu(false)
    action()
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {patient.nome.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Informações */}
        <div>
          <h3 className="font-semibold text-gray-900">{patient.nome}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {formatPhone(patient.telefone)}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {patient.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Status Badge */}
        <Badge variant={patient.status ? "default" : "secondary"}>
          {patient.status ? "Ativo" : "Inativo"}
        </Badge>

        {/* Menu de Ações */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={handleMenuClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => handleAction(() => onView(patient))}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleAction(() => onEdit(patient))}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleAction(() => onToggleStatus(patient))}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      patient.status ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {patient.status ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Inativar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}