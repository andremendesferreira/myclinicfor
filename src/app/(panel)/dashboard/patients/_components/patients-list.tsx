// ================================================================
// 📋 PATIENTS LIST - Componente Principal Modular
// ================================================================

"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { msgError, msgSuccess } from "@/components/custom-toast"
import { togglePatientStatus } from "../_act/toggle-patient-status"
import { PatientCard } from "./patient/patient-card"
import { ViewPatientModal } from "./patient/patient-view-modal"
import { EditPatientModal } from "./patient/patient-edit-modal"

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

interface PatientsListProps {
  patients: Patient[]
  onPatientUpdate: () => void
}

export function PatientsList({ patients, onPatientUpdate }: PatientsListProps) {
  // Estados simples e isolados
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [loadingPatientId, setLoadingPatientId] = useState<string | null>(null)

  // ===============================================
  // 🔄 HANDLERS SIMPLES
  // ===============================================

  const handleViewPatient = useCallback((patient: Patient) => {
    setViewPatient(patient)
  }, [])

  const handleEditPatient = useCallback((patient: Patient) => {
    setEditPatient(patient)
  }, [])

  const handleToggleStatus = useCallback(async (patient: Patient) => {
    // Confirmação simples
    const confirmed = window.confirm(
      `Tem certeza que deseja ${patient.status ? 'inativar' : 'ativar'} o paciente ${patient.nome}?`
    )
    
    if (!confirmed) return

    setLoadingPatientId(patient.id)
    
    try {
      const result = await togglePatientStatus({
        patientId: patient.id,
        status: !patient.status
      })
      
      if (result.success) {
        msgSuccess(
          patient.status 
            ? "Paciente inativado com sucesso!" 
            : "Paciente ativado com sucesso!"
        )
        onPatientUpdate()
      } else {
        msgError(result.error || "Erro ao alterar status do paciente")
      }
    } catch (error) {
      msgError("Erro inesperado. Tente novamente.")
    } finally {
      setLoadingPatientId(null)
    }
  }, [onPatientUpdate])

  const handleCloseViewModal = useCallback(() => {
    setViewPatient(null)
  }, [])

  const handleCloseEditModal = useCallback(() => {
    setEditPatient(null)
  }, [])

  const handleEditSuccess = useCallback(() => {
    setEditPatient(null)
    onPatientUpdate()
  }, [onPatientUpdate])

  // ===============================================
  // 🎨 RENDERIZAÇÃO
  // ===============================================

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum paciente cadastrado
          </h3>
          <p className="text-gray-600 text-center mb-4">
            Comece cadastrando seu primeiro paciente para gerenciar consultas e histórico médico.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pacientes ({patients.length})
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <PatientCard
                key={`patient-${patient.id}-${patient.updatedAt}`}
                patient={patient}
                onView={handleViewPatient}
                onEdit={handleEditPatient}
                onToggleStatus={handleToggleStatus}
                isLoading={loadingPatientId === patient.id}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewPatientModal 
        patient={viewPatient}
        isOpen={!!viewPatient}
        onClose={handleCloseViewModal}
      />
      
      <EditPatientModal 
        patient={editPatient}
        isOpen={!!editPatient}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </>
  )
}