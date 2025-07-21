"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { msgError } from "@/components/custom-toast";
import { DowngradeDialogProps } from "../_types/plan.types";
import { MessageCircleWarningIcon } from "lucide-react";
import { goPortalCustomer } from "../_act/go-portal-customer";

export function DowngradeDialog({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  currentPlan,
  targetPlan,
  isLoading = false
}: DowngradeDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onOpenChange(false);
      const response = await goPortalCustomer();
      if (response.error){
        msgError("Erro ao tentar abrir portal de assinatura.");
        return;
      }

      window.location.href = response.sessionId;
      
    } catch (error) {
      msgError(`Erro ao processar downgrade: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar mudança de plano</DialogTitle>
          <DialogDescription asChild>
            <div>
              <p className="text-gray-600 mb-4">
                Você está prestes a alterar do plano <strong>{currentPlan}</strong>, para o plano <strong>{targetPlan}</strong>.
              </p>
              {targetPlan === 'FREE' && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-center">
                  <div className="w-10 mr-2"><MessageCircleWarningIcon className="text-amber-700 h-8 w-8"/></div>
                  <div className="space-y-1">
                    <p className="text-amber-800 font-medium">
                    Esta ação resultará na perda de recursos do seu plano atual.
                    </p>
                    <p className="text-amber-800 font-medium">
                      Ao confirmar, iremos solicitar a prestado a exclusão da mensalidade vinculada ao plano.
                    </p>
                    <p className="text-amber-800 font-medium">
                      Após o vencimento do próximo pagamento, automaticamente será migrado de plano.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            className="w-full sm:w-auto"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="mr-2">⏳</span>
                Processando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}