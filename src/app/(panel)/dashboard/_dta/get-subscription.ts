"use server"

import prisma from '@/lib/prisma'


export async function getSubscription({ userId }: { userId: string }) {

  if (!userId) {
    return []
  }

  try {

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: userId
      }
    })

    return subscription;


  } catch (err) {
    console.log(err);
    return []
  }

}