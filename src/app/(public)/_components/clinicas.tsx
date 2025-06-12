import { Button } from "@/components/ui/button";
export function Clinicas() {
  return (
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sn:px-6 lg:px-8 py-16">
          <h2 className="text-3xl text-center font-bold tracking-tight text-zinc-900 dark:text-white">
            Nossas Clínicas
          </h2>
          <p className="mt-2 text-center text-base text-zinc-600 dark:text-zinc-400">
            Encontre a clínica ideal para você.
          </p>
          <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">Clínica A</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Endereço: Rua Exemplo, 123</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">Telefone: (11) 1234-5678</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">Especialidades: Cardiologia, Dermatologia</p>
              <div className="mt-4">
                <Button className="bg-blue-950 text-white hover:bg-blue-900 shadow-blue-200 hover:shadow-md">
                  Agendar Consulta
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>
  );
}