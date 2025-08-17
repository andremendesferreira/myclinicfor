"use server"

import prisma from "@/lib/prisma"

export async function getProfessionalsRanked() {

  try {
    // Busca os profissionais com suas assinaturas ativas.
    // Configurado com ordenação por prioridade.
      const professionals = await prisma.$queryRaw`
            SELECT tt.* 
      FROM (
          SELECT u.*, s.id as "subId", s.status as "subStatus", s.plan, s."priceId", s."createdAt" as "subCreatedAt", s."updatedAt" as "subUpdatedAt", "userId", 
                 (CASE 
                     WHEN s."priceId" = ${process.env.NEXT_PUBLIC_TOP_PRIORITY} THEN 0
                     WHEN s.plan = 'PREMIUM' THEN 1
                     WHEN s.plan = 'PROFESSIONAL' THEN 2
                     WHEN s.plan = 'BASIC' THEN 3
                     WHEN s.plan = 'FREE' THEN 4
                     ELSE 9
                 END) as ranked
          FROM "User" u
          LEFT JOIN "Subscription" s ON u.id = s."userId"
          WHERE u.status = true
      ) tt
      ORDER BY tt.ranked ASC, tt."subStatus" DESC, tt."subUpdatedAt" ASC`;

    return professionals;

  } catch (err) {
    console.error("Error fetching professionals:", err);
    return []
  }

}