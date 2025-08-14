import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WEEK_DAYS } from '@/app/utils/time.utils';
import { DaySchedule } from './schedule-day';

interface ScheduleTabsProps {
  selectedHours: string[];
  onToggleHour: (dayId: number, hour: string) => void;
}

export function ScheduleTabs({ selectedHours, onToggleHour }: ScheduleTabsProps) {
  return (
    <Tabs defaultValue="1" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        {WEEK_DAYS.map((day) => (
          <TabsTrigger key={day.id} value={day.id.toString()}>
            {day.short}
          </TabsTrigger>
        ))}
      </TabsList>

      {WEEK_DAYS.map((day) => (
        <TabsContent key={day.id} value={day.id.toString()}>
          <DaySchedule
            day={day}
            selectedHours={selectedHours}
            onToggleHour={onToggleHour}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}