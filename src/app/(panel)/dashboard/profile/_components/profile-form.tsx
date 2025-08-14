import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface UseProfileFormProps {
  name: string | null;
  address: string | null;
  phone: string | null;
  status: boolean;
  timeZone: string | null;
  activities: string[] | [];
}

const profileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string().min(1, { message: "O time zone é obrigatório" }),
  activities: z.array(z.string()),
})

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({ name, address, phone, status, timeZone, activities }: UseProfileFormProps) {
  // Log para debug - remova depois
  console.log('useProfileForm - status recebido:', status, typeof status);
  
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || "",
      address: address || "",
      phone: phone || "",
      status: Boolean(status), // Força conversão para boolean
      timeZone: timeZone || "",
      activities: activities || []
    }
  })
}