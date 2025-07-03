"use server"

import prisma from '@/lib/prisma'

interface GetAppointmentDate{
  startDt?: string;
  finalDt?: string;
}

function currentDateSelected({ startDt, finalDt }: GetAppointmentDate)  {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();
  if ( !startDt || startDt === '' ) 
    { 
      startDt = new Date(year, month, day, 0, 0, 0, 0).toISOString()
    };
  if ( !finalDt || finalDt === '' ) 
    { 
      finalDt = new Date(year, month+1, day, 0, 0, 0, 0).toISOString()
    };
  
  const data = { startDt: startDt , finalDt: finalDt };

  return data;
}

interface GetUserAppointmentProps {
  userId: string;
  startDt?: string;
  finalDt?: string;
}

export async function getAppointments({userId, startDt, finalDt}: GetUserAppointmentProps) {

  if (!userId) {
    return []
  }

  if (!startDt || startDt === ''){
    const Date = currentDateSelected({ startDt: undefined, finalDt: undefined });
    startDt = Date.startDt;
    finalDt = Date.finalDt;
  }

    if (!finalDt || finalDt === ''){
    const Date = currentDateSelected({ startDt: startDt, finalDt: undefined });
    finalDt = Date.finalDt;
  }

  try {

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentDate: {
          gte: startDt,
          lte: finalDt
        }
      },
      include: {
        service: true
      }
    })

    return appointments;


  } catch (err) {
    console.log(err);
    return []
  }
}