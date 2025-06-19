"use server"

import prisma from "@/lib/prisma";

interface GetUserServicesDataProps {
  userId: string;
  status: boolean | true
}

export async function getUserServicesData({ userId, status }: GetUserServicesDataProps) {
  try {

    if (!userId) {
      throw new Error("Falha ao buscar serviços.");
    }

    const services = await prisma.service.findMany({
      where: {
        userId: userId,
        status: status? true : false
      }
    })

    if (!services) {
      return null;
    }

    return services;

  } catch (err) {
    console.log(err);
    return null;
  }
}