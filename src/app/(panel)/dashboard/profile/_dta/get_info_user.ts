"use server"

import prisma from "@/lib/prisma";

export async function getUserData(userId: string){
    try{

        const user = await prisma.user.findFirst({
            where: {
                id: userId                
            },
            include: {
                subscription: true,
            }
        })

        if(!user){
            return null;
        }

        // console.log(user)
        return user;

    }catch(err){
        console.log(err);
        return;
    }
}