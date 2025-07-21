import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ftProf1 from '../../../../public/prof1.jpg';
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { Prisma } from "@/generated/prisma";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfessionalsProps {
  professionals: UserWithSubscription[]
}


export function Professionals({ professionals }: ProfessionalsProps): React.ReactElement {
  return (
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sn:px-6 lg:px-8 py-4">
          <h2 className="text-3xl text-center font-bold tracking-tight text-zinc-900 dark:text-white">
            Profissionais de Saúde
          </h2>
          <p className="mb-4 text-center text-base text-zinc-600 dark:text-zinc-400">
            Encontre o profissional ideal para você.
          </p>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {professionals.map((clinic) => (
              <Card className="overflow-hidden p-0 hover:shadow-lg duration-300" key={clinic.id}>
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={clinic.image ?? ftProf1}
                      alt="Foto da clinica"
                      sizes="(max-width: 400px) 100vw, 33vw"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">{clinic.name}</h3>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400"><span className="font-semibold">Endereço:</span> {clinic.address}</p>
                        {/* <p className="text-sm text-zinc-600 dark:text-zinc-400"><span className="font-semibold">Especialidades:</span> {clinic.specialties.join(', ')}</p> */}
                      </div>
                      {/* <div className={`w-2.5 h-2.5 rounded-full ${clinic.subscription?.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`}></div> */}
                    </div>
                  </div>
                  <div className="w-full mt-2 mb-4 justify-center flex">
                    <Link href={`/clinic/${clinic.id}`} target="_blank">
                      <Button className="w-full py-2 text-sm font-medium md:text-base bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md">
                        <CalendarPlus className="w-6 h-6 text-white" />
                        Agendar Consulta
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </section>
  );
}