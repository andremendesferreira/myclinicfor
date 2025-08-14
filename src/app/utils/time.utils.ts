// ==============================================
// @/app/utils/time.utils.ts
// ==============================================

export type WeekDay = {
  id: number;
  name: string;
  short: string;
}

export function generateTimeSlots(): string[] {
  const hours: string[] = [];
  
  for (let i = 0; i <= 24; i++) {
    for (let j = 0; j < 2; j++) {
      if (i !== 24) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 30).toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      } else {
        const hour = i.toString().padStart(2, "0");
        const minute = "00";
        hours.push(`${hour}:${minute}`);
        break;
      }
    }
  }
  
  return hours;
}

export const WEEK_DAYS: WeekDay[] = [
  { id: 1, name: 'Segunda-feira', short: 'SEG' },
  { id: 2, name: 'Terça-feira', short: 'TER' },
  { id: 3, name: 'Quarta-feira', short: 'QUA' },
  { id: 4, name: 'Quinta-feira', short: 'QUI' },
  { id: 5, name: 'Sexta-feira', short: 'SEX' },
  { id: 6, name: 'Sábado', short: 'SAB' },
  { id: 0, name: 'Domingo', short: 'DOM' }
];