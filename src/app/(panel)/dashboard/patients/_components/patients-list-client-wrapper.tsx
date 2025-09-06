"use client"

import { useState, useTransition, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Loader2, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PatientsList } from "./patients-list"

// ===============================================
// 🔧 HOOK DE DEBOUNCE INLINE
// ===============================================
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

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
  hasPermission: boolean
}

export function PatientsListClientWrapper({ 
  initialPatients, 
  userId,
  hasPermission
}: PatientsListClientWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  // Estados da pesquisa
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounce da pesquisa para performance
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // ===============================================
  // 🔍 FILTRO LOCAL EM TEMPO REAL - CORRIGIDO
  // ===============================================
  const filteredPatients = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return initialPatients // Retorna todos se não há pesquisa
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim()
    const searchNumbers = debouncedSearchTerm.replace(/\D/g, '') // Para CPF e telefone
    
    return initialPatients.filter(patient => {
      const matchName = patient.nome.toLowerCase().includes(searchLower)
      const matchEmail = patient.email.toLowerCase().includes(searchLower)
      
      // ✅ CORREÇÃO: Só busca por números se realmente há números na pesquisa
      const matchCPF = searchNumbers.length > 0 
        ? patient.cpf.replace(/\D/g, '').includes(searchNumbers)
        : false
        
      const matchPhone = searchNumbers.length > 0 
        ? patient.telefone.replace(/\D/g, '').includes(searchNumbers)
        : false
      
      return matchName || matchEmail || matchCPF || matchPhone
    })
  }, [initialPatients, debouncedSearchTerm])

  // ===============================================
  // 🔄 EFEITOS DE SINCRONIZAÇÃO
  // ===============================================

  // Atualizar URL quando pesquisa muda
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''
    
    // Só atualiza se realmente mudou
    if (debouncedSearchTerm !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString())
      
      if (debouncedSearchTerm.trim()) {
        params.set('search', debouncedSearchTerm.trim())
      } else {
        params.delete('search')
      }
      
      const newUrl = params.toString() ? `?${params.toString()}` : '/dashboard/patients'
      
      startTransition(() => {
        router.replace(newUrl, { scroll: false })
      })
    }
  }, [debouncedSearchTerm, router, searchParams])

  // Simular loading para UX melhor
  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      setIsSearching(true)
      
      // Simular pequeno delay para UX
      const timeout = setTimeout(() => {
        setIsSearching(false)
      }, 200)

      return () => clearTimeout(timeout)
    } else {
      setIsSearching(false)
    }
  }, [debouncedSearchTerm])

  // ===============================================
  // 🎛️ HANDLERS
  // ===============================================

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Pesquisa já acontece automaticamente via debounce
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handlePatientUpdate = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  // ===============================================
  // 🎨 RENDERIZAÇÃO
  // ===============================================
  return (
    <div className="space-y-6 w-full">
      {/* ✅ BARRA DE PESQUISA NO TOPO DA LISTA */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 w-full"
          />
          {/* Botão de limpar pesquisa */}
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7 w-7 p-0 text-red-500"
              onClick={handleClearSearch}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          {/* Loader de pesquisa */}
          {isSearching && (
            <div className="absolute right-10 top-3">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            </div>
          )}
        </div>
        {searchTerm && (
          <div className="ml-4 hidden sm:flex gap-2">
            {/* ✅ CONTADOR CORRETO */}
            {searchTerm.length > 0 && (
              <div className="flex items-center px-3 py-2 bg-blue-50 rounded-md text-sm text-blue-600 whitespace-nowrap">
                {filteredPatients.length} resultado{filteredPatients.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>)}
      </form>

      {/* ✅ LISTA DE PACIENTES */}
      <PatientsList 
        patients={filteredPatients} 
        onPatientUpdate={handlePatientUpdate}
        isLoading={isPending || isSearching}
        searchTerm={debouncedSearchTerm}
      />
    </div>
  )
}