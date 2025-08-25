"use client"

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function msgSuccess(message: string){
      toast.success(message, {
        style: {
        border: '2px solid var(--color-emerald-200)', // Cor da borda
        borderRadius: '8px', // Raio da borda
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra suave
        backgroundColor: 'var(--color-emerald-100)', // Cor de fundo
        color: 'var(--color-emerald-800)', // Cor do texto
     },
  });
}
export function msgError(message: string){
      toast.error(message, {
        style: {
        border: '2px solid var(--color-red-200)', // Cor da borda
        borderRadius: '8px', // Raio da borda
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra suave
        backgroundColor: 'var(--color-red-100)', // Cor de fundo
        color: 'var(--color-red-800)', // Cor do texto
     },
  });
}
export function msgWarning(message: string){
      toast.error(message, {
        style: {
        border: '2px solid var(--color-yellow-200)', // Cor da borda
        borderRadius: '8px', // Raio da borda
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra suave
        backgroundColor: 'var(--color-yellow-100)', // Cor de fundo
        color: 'var(--color-yellow-800)', // Cor do texto
     },
  });
}
export function msgInfo(message: string){
      toast.error(message, {
        style: {
        border: '2px solid var(--color-blue-200)', // Cor da borda
        borderRadius: '8px', // Raio da borda
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Sombra suave
        backgroundColor: 'var(--color-blue-100)', // Cor de fundo
        color: 'var(--color-blue-800)', // Cor do texto
     },
  });
}
export function msgLoading(message: string){
  return toast.loading(message, {
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    style: {
      border: '2px solid var(--color-gray-200)',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'var(--color-gray-100)',
      color: 'var(--color-gray-800)',
    },
    // Loading toasts precisam ser dismissed manualmente
  });
}