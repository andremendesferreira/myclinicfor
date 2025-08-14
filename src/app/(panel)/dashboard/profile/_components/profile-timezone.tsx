import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { ProfileFormData } from './profile-form';
import { getBrazilTimeZones } from '@/app/utils/timezone.utils';

interface TimeZoneSelectProps {
  control: Control<ProfileFormData>;
}

export function TimeZoneSelect({ control }: TimeZoneSelectProps) {
  const timeZones = getBrazilTimeZones();

  return (
    <FormField
      control={control}
      name="timeZone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className='font-semibold'>
            Selecione o fuso horário
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o seu fuso horário" />
              </SelectTrigger>
              <SelectContent>
                {timeZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}