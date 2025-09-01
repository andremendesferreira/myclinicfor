// app/(panel)/dashboard/patients/_components/patients-header.tsx
"use client"

import { useState } from "react"
import { Plus, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreatePatientForm } from "./create-patient-form"

interface PatientsHeaderProps {
  hasPermission: boolean
}

export function PatientsHeader({ hasPermission }: PatientsHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("")
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
          <DialogContent  className="lg:min-w-lg sm:max-w-md w-full p-0 m-0 [&>button]:hidden">
          <DialogHeader className="p-0 m-0">
              <DialogClose className="absolute right-1 mt-2">
                <Button
                  className="mr-1"
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

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>
    </div>
  )
}