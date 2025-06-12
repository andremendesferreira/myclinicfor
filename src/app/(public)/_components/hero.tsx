import { Button } from "@/components/ui/button";
import Image from "next/image";
import docImg from '../../../../public/doctor-hero.png'
export function Hero() {
  return (
      <section className="bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8">
          <main className="flex items-center justify-center">
            <article className="flex-[2] max-w-3xl space-y-8 flex flex-col items-start justify-center">
              <h1 className="max-w-2xl text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Encontre os melhores profissionais de saúde de Fortaleza em um único local!
              </h1>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400">
                Somos uma plataforma voltada para profissionais de saúde, com foco em agilidade e eficiência de atendimento de forma prática e organizada.
              </p>
              <Button className="bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md w-fit px-6 font-semibold">
                Encontre uma clinica
              </Button>
            </article>
            <div className="hidden lg:block">
              <Image
                src={docImg}
                alt="Foto de um profissional de saúde"
                width={440}
                height={600}
                quality={100}
                priority
                className="object-contain"/>
            </div>
          </main>
        </div>
      </section>
  );
}