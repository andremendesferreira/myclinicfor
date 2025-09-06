// app/(panel)/dashboard/patients/_components/patients-header.tsx
"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreatePatientForm } from "./create-patient-form"

interface PatientsHeaderProps {
  hasPermission: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  isSearching?: boolean
  resultsCount?: number
}

export function PatientsHeader({ 
  hasPermission, 
  searchTerm, 
  onSearchChange,
  isSearching = false,
  resultsCount 
}: PatientsHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  // Sincronizar com prop externa
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearchTerm.trim())
  }

  const handleClearSearch = () => {
    setLocalSearchTerm("")
    onSearchChange("")
  }

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
            {resultsCount !== undefined && searchTerm && (
              <span className="ml-2 text-blue-600 font-medium">
                {resultsCount} resultado{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
              </span>
            )}
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
              {/* ✅ CORRIGIDO: Usando asChild */}
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

      {/* Barra de pesquisa e filtros */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por nome, CPF ou email..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {/* Botão de limpar pesquisa */}
          {localSearchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {/* Loader de pesquisa */}
          {isSearching && (
            <div className="absolute right-10 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* Botão de Filtros - agora funciona como busca */}
          <Button 
            type="submit"
            variant="outline" 
            className="w-full sm:w-auto"
            disabled={isSearching}
          >
            <Search className="h-4 w-4 mr-2" />
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
          
          {/* Botão para limpar filtros se tiver pesquisa ativa */}
          {searchTerm && (
            <Button 
              type="button"
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}