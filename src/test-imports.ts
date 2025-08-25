// Arquivo temporário para testar imports
import { createPatientSchema, validateCPF } from '@/lib/validations'
import { handleServerAction } from '@/lib/server-actions/template'

console.log('✅ Imports funcionando!')
console.log('CPF válido:', validateCPF('12345678901'))

export {} // Para evitar erro de module