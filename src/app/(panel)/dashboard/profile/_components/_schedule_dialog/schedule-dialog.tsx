import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight } from 'lucide-react';
import { ScheduleTabs } from './schedule-tabs';

interface ScheduleDialogProps {
  hasExistingSchedule: boolean;
  selectedHours: string[];
  onToggleHour: (dayId: number, hour: string) => void;
  onClearAllHours: () => void;
}

export function ScheduleDialog({ 
  hasExistingSchedule, 
  selectedHours, 
  onToggleHour, 
  onClearAllHours 
}: ScheduleDialogProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <div className='space-y-2'>
      <Label className='font-semibold'>
        Configurar horários da clínica
      </Label>

      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className='w-full justify-between cursor-pointer'>
            {hasExistingSchedule 
              ? 'Clique aqui para modificar os horários' 
              : 'Clique aqui para cadastrar horários'
            }
            <ArrowRight className='w-5 h-5' />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Horários de atendimento por dia da semana</DialogTitle>
            <DialogDescription>
              Selecione os horários de funcionamento para cada dia da semana:
            </DialogDescription>
          </DialogHeader>

          <ScheduleTabs 
            selectedHours={selectedHours}
            onToggleHour={onToggleHour}
          />

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className='flex-1 cursor-pointer'
              onClick={onClearAllHours}
            >
              Limpar Todos
            </Button>
            <Button
              type="button"
              className='flex-1 bg-emerald-600 hover:bg-emerald-500 cursor-pointer'
              onClick={() => setDialogIsOpen(false)}
            >
              Salvar Horários
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}