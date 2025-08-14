import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateTimeSlots } from '@/app/utils/time.utils';
import { WeekDay } from '../../types/profile.types';

interface DayScheduleProps {
  day: WeekDay;
  selectedHours: string[];
  onToggleHour: (dayId: number, hour: string) => void;
}

export function DaySchedule({ day, selectedHours, onToggleHour }: DayScheduleProps) {
  const hours = generateTimeSlots();

  function getSelectedHoursForDay(dayId: number): string[] {
    return selectedHours
      .filter(timeSlot => timeSlot.startsWith(`${dayId}-`))
      .map(timeSlot => timeSlot.split('-')[1]);
  }

  function isHourSelected(dayId: number, hour: string): boolean {
    return selectedHours.includes(`${dayId}-${hour}`);
  }

  return (
    <Card>
      <CardHeader className="pb-0 mb-0">
        <CardTitle className="text-lg">
          {day.name}
        </CardTitle>
        <CardDescription className="text-sm pb-0 mb-0">
          <span className="text-sm text-zinc-500">Segmento de tempo 30 minutos.</span>
          <p className='text-sm text-muted-foreground mb-0 pb-0'>
            Clique nos horários abaixo para marcar ou desmarcar:
          </p>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-0 pt-0">
        <div className='mt-0 pt-0 grid grid-cols-5 gap-2'>
          {hours.map((hour) => (
            <Button
              key={hour}
              type="button"
              variant="outline"
              className={cn(
                'h-10', 
                isHourSelected(day.id, hour) && 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
              )}
              onClick={() => onToggleHour(day.id, hour)}
            >
              {hour}
            </Button>
          ))}
        </div>

        {getSelectedHoursForDay(day.id).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md border-emerald-600 border-2">
            <p className="text-sm font-medium text-gray-700">
              Horários selecionados para {day.name}:
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {getSelectedHoursForDay(day.id).join(' • ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}