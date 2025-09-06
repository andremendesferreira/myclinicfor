// OPÇÃO 1: Criar um novo componente PatientsHeaderSimple
// Arquivo: src/app/(panel)/dashboard/patients/_components/patients-header-simple.tsx

"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreatePatientForm } from "./create-patient-form"

interface PatientsHeaderSimpleProps {
  hasPermission: boolean
}

export function PatientsHeaderSimple({ hasPermission }: PatientsHeaderSimpleProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Título e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Pacientes
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie o cadastro de pacientes.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={!hasPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="lg:min-w-lg sm:max-w-md w-full p-0 m-0 [&>button]:hidden">
            <DialogTitle hidden className="m-0! p-0!">Novo Paciente</DialogTitle>
            <DialogHeader className="p-0 m-0">
              <DialogClose asChild>
                <Button
                  className="absolute right-1 mt-2 mr-1"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  <X className='w-4 h-4' />
                </Button>
              </DialogClose>
            </DialogHeader>
            <CreatePatientForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}