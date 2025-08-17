"use server"

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formSchema = z.object({
  image: z.string().min(50, { message: "A URL é obrigatória." }),
})

type FormSchema = z.infer<typeof formSchema>

export async function updateUrlAvatar(avatar: FormSchema){

    const session = await auth();

    if(!session?.user?.id){
        return{
            error: "Usuário não encontrado.",
        }
    }

    const schema = formSchema.safeParse(avatar)
    
    if(!schema.success){
        return{
            error: "Preencha todos os campos obrigatórios."
        }
    }

    try{
        await prisma.user.update({
            where:{
                id: session?.user?.id
            },
            data:{
                image: avatar.image
            }
        })

        revalidatePath("/dashboard/profile")

        return {
            data: `Imagem de perfil atualizada com sucesso!`
        }

    }catch(err){
        console.log(err)
        return{
            error: "Falha ao atualizar imagem de perfil."
        }
    }

}