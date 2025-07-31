"use client"

import { Button } from "@/components/ui/button";
import { TimeSlot } from "./schedule-content";
import { cn } from '@/lib/utils';
import { isSlotInThePast, isToday, isSlotSequenceAvailable } from './schedule-utils';

interface ScheduleTimeListProps {
  selectedDate: Date;
  selectedTime: string;
  requiredSlots: number;
  blockedTimes: string[];
  availableTimeSlots: TimeSlot[];
  clinicTimes: string[];
  onSelectTime: (time: string) => void;
}

export function ScheduleTimeList({
  selectedDate,
  availableTimeSlots,
  blockedTimes,
  clinicTimes,
  requiredSlots,
  selectedTime,
  onSelectTime
}: ScheduleTimeListProps) {
  
  const dateIsToday = isToday(selectedDate);
  // console.log(`teste sequenceOK `, availableTimeSlots);

  const weekDayIndex: string = `${selectedDate.getUTCDay()}`;
  
  const clinicTimesFiltered = clinicTimes
  .filter(time => time.startsWith(`${weekDayIndex}-`))
  .map(time => time.replace(`${weekDayIndex}-`, ''));

  // Filtrando e modificando o availableTimeSlots

  return (

    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {availableTimeSlots.map((slot) => {

        //console.log('testes: ', slot.time ,requiredSlots,clinicTimesFiltered,blockedTimes)
        const sequenceOk = isSlotSequenceAvailable(
          slot.time,
          requiredSlots,
          clinicTimesFiltered,
          blockedTimes
        )

        // console.log('verify_slot: ',slot.time)

        const slotIsPast = dateIsToday && isSlotInThePast(slot.time);
        
        //console.log('é hoje:', dateIsToday, 'passou o horário', isSlotInThePast(slot.time));
        const slotEnabled = slot.available && sequenceOk && !slotIsPast;
        //console.log('slotEnabled:', slot.available, 'sequenceOk', sequenceOk, 'passou horario:', !slotIsPast );

        return (
          <Button
            onClick={() => slotEnabled && onSelectTime(slot.time)}
            type="button"
            variant="outline"
            key={slot.time}
            disabled={!slotEnabled}  
            className={cn("h-10 select-none",
              selectedTime === slot.time && "border-2 border-emerald-500 text-primary",
              !slotEnabled && "opacity-50 cursor-not-allowed bg-emerald-100 hover:opacity-50 hover:bg-emerald-100 hover:cursor-not-allowed"
            )}
          >
            {slot.time}
          </Button>
        )
      })}

    </div>
  )
}