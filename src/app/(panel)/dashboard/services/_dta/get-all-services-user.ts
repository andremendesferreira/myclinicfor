"use server"

import prisma from "@/lib/prisma";

interface GetUserServicesDataProps {
  userId: string;
  status?: boolean
}

export async function getUserServicesData({ userId, status }: GetUserServicesDataProps) {
  try {

    if (!userId) {
      throw new Error("Falha ao buscar serviços.");
    }

    if(status === undefined){
      const services = await prisma.service.findMany({
        where: {
          userId: userId
        }
      })

      if (!services) {
        return null;
      }
    
      return services;
      
    } else {

      const services = await prisma.service.findMany({
        where: {
          userId: userId,
          status: status
        }
      })

      if (!services) {
        return null;
      }
    
      return services;
      
    }

  } catch (err) {
    console.log(err);
    return null;
  }
}