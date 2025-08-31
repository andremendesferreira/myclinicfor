"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  EyeOff,
  MapPin,
  FileText,
  AlertTriangle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreatePatientForm } from "./create-patient-form"
import { formatCPF } from "@/app/utils/formatCPF"
import { formatPhone } from "@/app/utils/formatPhone"
import { useCreatePatientForm } from "@/lib/validations/hooks"
import { formatPhone as formatPhoneValidation, formatCPF as formatCPFValidation } from "@/lib/validations"
import { capitalizeProperNames } from "@/app/utils/formatName"
import { msgError, msgSuccess, msgLoading } from "@/components/custom-toast"
import { toast } from "sonner"
import { updatePatient } from "../_act/update-patient"
import { togglePatientStatus } from "../_act/toggle-patient-status"

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

// Componente para visualizar detalhes do paciente
function ViewPatientDialog({ patient, isOpen, onOpenChange }: {
  patient: Patient | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!patient) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detalhes do Paciente
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cabeçalho com foto e nome */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xl">
                {patient.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{patient.nome}</h2>
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

          {/* Informações pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">CPF:</span>
                <span className="text-gray-900">{formatCPF(patient.cpf)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">Telefone:</span>
                <span className="text-gray-900">{formatPhone(patient.telefone)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{patient.email}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {patient.endereco && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Endereço:</span>
                    <p className="text-gray-900">{patient.endereco}</p>
                  </div>
                </div>
              )}
              
              {patient.convenio && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-700">Convênio:</span>
                  <span className="text-gray-900">{patient.convenio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">Cadastrado:</span>
              <span className="text-gray-900">
                {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-700">Atualizado:</span>
              <span className="text-gray-900">
                {new Date(patient.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para editar paciente
function EditPatientDialog({ patient, isOpen, onOpenChange, onSuccess }: {
  patient: Patient | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useCreatePatientForm()

  // Preencher formulário com dados do paciente quando abrir
  useState(() => {
    if (patient && isOpen) {
      setValue('nome', patient.nome)
      setValue('cpf', patient.cpf)
      setValue('telefone', patient.telefone)
      setValue('email', patient.email)
      setValue('endereco', patient.endereco || '')
      setValue('convenio', patient.convenio || '')
    }
  })

  const onSubmit = async (data: any) => {
    if (!patient) return

    setIsLoading(true)
    const loadingToastId = msgLoading("Atualizando paciente...")
    
    try {
      const result = await updatePatient({
        id: patient.id,
        ...data
      })
      
      toast.dismiss(loadingToastId)
      
      if (result.success) {
        msgSuccess("Paciente atualizado com sucesso!")
        onOpenChange(false)
        onSuccess()
      } else {
        msgError(result.error || "Erro ao atualizar paciente")
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPFValidation(e.target.value)
    setValue('cpf', formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneValidation(e.target.value)
    setValue('telefone', formatted)
  }

  if (!patient) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Paciente
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do paciente {patient.nome}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              {...register("nome")}
              disabled={isLoading}
              onChange={(e) => {
                const formattedValue = capitalizeProperNames(e.target.value);
                setValue('nome', formattedValue);
              }}
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.nome.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CPF */}
            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                maxLength={14}
                onChange={handleCPFChange}
                disabled={isLoading}
                className={errors.cpf ? "border-red-500" : ""}
              />
              {errors.cpf?.message && (
                <p className="text-sm text-red-500 mt-1">{String(errors.cpf.message)}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register("telefone")}
                maxLength={15}
                onChange={handlePhoneChange}
                disabled={isLoading}
                className={errors.telefone ? "border-red-500" : ""}
              />
              {errors.telefone?.message && (
                <p className="text-sm text-red-500 mt-1">{String(errors.telefone.message)}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.email.message)}</p>
            )}
          </div>

          {/* Endereço */}
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              {...register("endereco")}
              disabled={isLoading}
              className={errors.endereco ? "border-red-500" : ""}
            />
            {errors.endereco?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.endereco.message)}</p>
            )}
          </div>

          {/* Convênio */}
          <div>
            <Label htmlFor="convenio">Convênio</Label>
            <Input
              id="convenio"
              {...register("convenio")}
              disabled={isLoading}
              className={errors.convenio ? "border-red-500" : ""}
            />
            {errors.convenio?.message && (
              <p className="text-sm text-red-500 mt-1">{String(errors.convenio.message)}</p>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function PatientsList({ patients, onPatientUpdate }: PatientsListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleToggleStatus = async (patient: Patient) => {
    const loadingToastId = msgLoading(
      patient.status ? "Inativando paciente..." : "Ativando paciente..."
    )
    
    try {
      const result = await togglePatientStatus({
        patientId: patient.id,
        status: !patient.status
      })
      
      toast.dismiss(loadingToastId)
      
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
      toast.dismiss(loadingToastId)
      msgError("Erro inesperado. Tente novamente.")
    }
  }

  const handleViewPatient = (patient: Patient) => {
    setViewPatient(patient)
    setIsViewDialogOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditPatient(patient)
    setIsEditDialogOpen(true)
  }

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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                <DialogDescription>
                  Preencha os dados do paciente para cadastrá-lo no sistema.
                </DialogDescription>
              </DialogHeader>
              <CreatePatientForm onSuccess={() => {
                setIsCreateDialogOpen(false)
                onPatientUpdate()
              }} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Pacientes</span>
            <Badge variant="secondary">{patients.length} pacientes</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patients.map((patient) => (
              <div 
                key={patient.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Informações do paciente */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {patient.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.nome}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">CPF:</span>
                          {formatCPF(patient.cpf)}
                        </span>
                        <Badge variant={patient.status ? "outline" : "secondary"} 
                               className={patient.status ? "text-green-600 border-green-200" : ""}>
                          {patient.status ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contatos */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 ml-13">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {formatPhone(patient.telefone)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Cadastrado em {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Menu de ações */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="h-4 w-4 mr-2" />
                      Consultar
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className={patient.status ? "text-red-600" : "text-green-600"}
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
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            {patient.status ? "Inativar" : "Ativar"} Paciente
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja {patient.status ? "inativar" : "ativar"} o paciente{" "}
                            <strong>{patient.nome}</strong>?
                            {patient.status && (
                              <span className="block mt-2 text-sm">
                                Pacientes inativos não aparecerão nas listas principais, mas os dados serão preservados.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleToggleStatus(patient)}
                            className={patient.status 
                              ? "bg-red-600 hover:bg-red-700" 
                              : "bg-green-600 hover:bg-green-700"
                            }
                          >
                            {patient.status ? "Inativar" : "Ativar"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ViewPatientDialog 
        patient={viewPatient}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <EditPatientDialog 
        patient={editPatient}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          setIsEditDialogOpen(false)
          onPatientUpdate()
        }}
      />
    </>
  )
}