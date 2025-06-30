// Backend meusite.com/api/schedule/get-appointments
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const userId = searchParams.get('userId');
  const dtParam = searchParams.get('date');

  if (!userId || userId === "null" || !dtParam || dtParam === "null") {
    return NextResponse.json({
      error: "Nenhuma informação encontrada."
    }, {
      status: 400 
    });
  }

  try{
    const [ year, month, day ] = dtParam.split("-").map(Number);
    const gteDate = new Date(year, month -1, day, 0, 0, 0);
    const lteDate = new Date(year, month -1, day, 23, 59, 59, 999);

    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    })

    if (!user) {
      return NextResponse.json({
        error: "Nenhuma informação encontrada."
      }, {
        status: 400 
      })
    }
    
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
        appointmentDate: {
          gte: gteDate,
          lte: lteDate
        }
      },
      include: {
        service: true
      }
    })

    const blockedSlots = new Set<string>();

    for (const apt of appointments){
      const requiredSlots = Math.ceil(apt.service.duration / 30);
      const startIndex = user.times.indexOf(apt.time)

      if (startIndex !== -1){
        for ( let i=0; i < requiredSlots; i++ ){
          const blockedSlot = user.times[startIndex + i];
          if(blockedSlot){
            blockedSlots.add(blockedSlot);
          }
        }
      }
    }

    const blockedTimes = Array.from(blockedSlots);

    console.log("Horários bloqueados: ", blockedTimes);

    return NextResponse.json(blockedTimes);

  }catch(err){
    console.log(err);
        let errorMessage = "";
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === "string") {
            errorMessage = err;
        } else {
            errorMessage = "Erro desconhecido.";
        }
        return NextResponse.json(
          { message: "Um erro ocorreu ao tentar selecionar os dados da clínica.", 
            error: errorMessage},
          {status: 400}
        );
  }
}