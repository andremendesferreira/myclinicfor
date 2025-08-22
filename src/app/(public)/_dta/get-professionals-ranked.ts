"use server"

import prisma from "@/lib/prisma"

export async function getProfessionalsRanked() {

  try {
    // Busca os profissionais com suas assinaturas ativas.
    // Configurado com ordenação por prioridade.
    const professionals = await prisma.$queryRaw`SELECT * FROM public.vw_professional_ranked`;
    return professionals;

  } catch (err) {
    console.error("Error fetching professionals:", err);
    return []
  }

}