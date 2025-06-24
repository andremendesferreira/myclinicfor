"use server"

import prisma from "@/lib/prisma";

export async function getInfoSchedule({ userId }: { userId: string }) {
    try{
        if(!userId){
            return null;
        }

        const user = await prisma.user.findFirst({
            where:{
                id: userId
            },
            include: {
                subscription: true,
                services:true,
            }
        })

        if(!user){
            return null;
        }

        return user;

    }catch(err){
        let errorMessage = "";
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === "string") {
            errorMessage = err;
        } else {
            errorMessage = "Erro desconhecido.";
        }
        return {message: "Um erro ocorreu ao tentar selecionar os dados da clínica.", error: errorMessage}
    }
}