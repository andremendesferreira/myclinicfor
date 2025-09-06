// ================================================================
// 👀 PATIENT VIEW MODAL - Modal de Visualização de Paciente
// ================================================================
// Modal ajustado baseado no modelo patient-edit-modal.tsx
// Com imports corretos e estrutura consistente

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, Phone, Mail, FileText, MapPin, X, Calendar, Heart } from "lucide-react"
import { formatCPF } from "@/lib/validations" // ✅ CORRIGIDO: Import correto
import { formatPhone } from "@/app/utils/formatPhone" // ✅ CORRIGIDO: Import correto

interface Patient {
  id: string
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco?: string
  convenio?: string
  dataNascimento?: Date | string // ✅ ADICIONADO: Campo data de nascimento
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
  if (!patient) return null

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  // ✅ ADICIONADO: Função para calcular idade
  const calculateAge = (birthDate: Date | string) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="lg:min-w-lg sm:max-w-2xl w-full p-0 m-0 [&>button]:hidden">
        {/* HEADER */}
        <DialogHeader className="p-0 m-0">
          <DialogTitle className="pl-6 pt-6 mb-0 mr-0 ml-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Detalhes do Paciente
            </div>
            {/* ✅ CORRIGIDO: Usando asChild para evitar button dentro de button */}
            <DialogClose asChild>
              <Button
                className="absolute right-1 mt-0 mr-5"
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
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
                {/* ✅ ADICIONADO: Badge com idade se tiver data de nascimento */}
                {patient.dataNascimento && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {calculateAge(patient.dataNascimento)} anos
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
                  <span>{formatPhone(patient.telefone)}</span> {/* ✅ CORRIGIDO: formatPhone correto */}
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
                  <span className="font-mono">{formatCPF(patient.cpf)}</span> {/* ✅ CORRIGIDO: formatCPF correto */}
                </div>
                {/* ✅ ADICIONADO: Mostrar data de nascimento se existir */}
                {patient.dataNascimento && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Nascimento:</span>
                    <span>
                      {new Date(patient.dataNascimento).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {patient.convenio && (
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-gray-400" />
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
      </DialogContent>
    </Dialog>
  )
}