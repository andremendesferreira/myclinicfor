"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getActivitiesData() {

  try {
    const session = await auth();

    if (!session) {
      return null;
    }

    const activities = await prisma.activity.findMany({
      select:{
        name: true
      },
      where:{
        active: true
      }
    })

    if (!activities) {
      return null;
    }

    const activityNames: string[] = activities.map(activity => activity.name);

    return activityNames;

  } catch (err) {
    console.log(err);
    return null;
  }
}