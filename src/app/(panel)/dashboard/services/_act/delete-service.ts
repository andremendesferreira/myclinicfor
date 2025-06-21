"use server"

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const formToogleSchema = z.object({
    serviceId: z.string().min(1,"O código do serviço é obrigatório."),
    status: z.boolean()
})

type FormToogleSchema = z.infer<typeof formToogleSchema>

const formDeleteSchema = z.object({
    serviceId: z.string().min(1,"O código do serviço é obrigatório.")
})

type FormDeleteSchema = z.infer<typeof formDeleteSchema>

export async function inativeService(formData: FormToogleSchema) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: "Erro ao tentar inativar o serviço, usuário não encontrado."
        }
    }

    const schema = formToogleSchema.safeParse(formData);
    const info = formData.status ? "inativado" : "ativado";

    if(!schema.success){
        return {
            error: schema.error.issues[0].message
        }
    }
    
    try{

        await prisma.service.update({
            where: {
                id: formData.serviceId,
                userId: session?.user?.id
            },
            data:{
                status: !formData.status
            }
        })



        revalidatePath('/dashboard/services');
        
        return {
            data: `Serviço ${info} com sucesso.`
        }

    }catch(err){
        console.log(err);
        return {
            error: "Erro ao tentar inativar o serviço."
        }
    }
}

export async function deleteService(formData: FormDeleteSchema) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            error: "Erro ao tentar remover o serviço, usuário não encontrado."
        }
    }

    const schema = formDeleteSchema.safeParse(formData);

    if(!schema.success){
        return {
            error: schema.error.issues[0].message
        }
    }
    
    try{
        await prisma.service.delete({
            where: {
                id: formData.serviceId,
                userId: session?.user?.id
            }
        })

        revalidatePath('/dashboard/services');
        
        return {
            data: "Serviço removido com sucesso."
        }

    }catch(err){
        console.log(err);
        return {
            error: "Erro ao tentar remover o serviço."
        }
    }
}
