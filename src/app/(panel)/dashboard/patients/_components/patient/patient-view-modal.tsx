// ================================================================
// 👀 PATIENT VIEW MODAL - Modal de Visualização de Paciente
// ================================================================
// Arquivo: src/app/(panel)/dashboard/patients/_components/_patient/patient-view-modal.tsx

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Phone, Mail, FileText, MapPin, X } from "lucide-react"
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

interface ViewPatientModalProps {
  patient: Patient | null
  isOpen: boolean
  onClose: () => void
}

export function ViewPatientModal({ patient, isOpen, onClose }: ViewPatientModalProps) {
  if (!isOpen || !patient) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detalhes do Paciente
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Cabeçalho com avatar e nome */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {patient.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{patient.nome}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={patient.status ? "default" : "secondary"}>
                  {patient.status ? "Ativo" : "Inativo"}
                </Badge>
                {patient._count.consultations > 0 && (
                  <Badge variant="outline">
                    {patient._count.consultations} consulta{patient._count.consultations !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Contatos
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>{formatPhone(patient.telefone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span>{patient.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Informações
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">CPF:</span>
                  <span className="font-mono">{formatCPF(patient.cpf)}</span>
                </div>
                {patient.convenio && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Convênio:</span>
                    <span>{patient.convenio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {patient.endereco && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Endereço
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {patient.endereco}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-4 border-t">
            Cadastrado em: {new Date(patient.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <Button onClick={onClose} className="ml-auto block">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}