import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { ProfileFormData } from './profile-form';
import { formatPhone } from '@/app/utils/formatPhone';

interface BasicInfoFieldsProps {
  control: Control<ProfileFormData>;
}

export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-semibold'>Nome completo</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='Digite o nome da clínica...'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-semibold'>
              Endereço completo
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='Digite o endereço da clínica...'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-semibold'>
              Telefone
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='(99) 99999-9999'
                onChange={(e) => {
                  const formattedValue = formatPhone(e.target.value);
                  field.onChange(formattedValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}