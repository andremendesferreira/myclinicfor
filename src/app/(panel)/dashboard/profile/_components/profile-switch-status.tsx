import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Control } from 'react-hook-form';
import { ProfileFormData } from './profile-form';

interface StatusSwitchProps {
  control: Control<ProfileFormData>;
}

export function StatusSwitch({ control }: StatusSwitchProps) {
  return (
    <FormField
      control={control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className='font-semibold'>
            Funcionamento
          </FormLabel>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked)}
                className='cursor-pointer data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
                id="clinic-status"
              />
              <label 
                htmlFor="clinic-status" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {Boolean(field.value) ? "Clínica aberta" : "Clínica fechada"}
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}