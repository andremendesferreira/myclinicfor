"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PatientsList } from "./patients-list"

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

interface PatientsListClientWrapperProps {
  initialPatients: Patient[]
  userId: string
}

export function PatientsListClientWrapper({ 
  initialPatients, 
  userId 
}: PatientsListClientWrapperProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handlePatientUpdate = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <PatientsList 
      patients={initialPatients} 
      onPatientUpdate={handlePatientUpdate}
    />
  )
}