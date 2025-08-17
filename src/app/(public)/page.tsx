import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Professionals } from "./_components/profissionais";
import { Footer } from "./_components/footer";
//import { getProfessionals } from "./_dta/get-professionals";
import { getProfessionalsRanked } from "./_dta/get-professionals-ranked";

export const revalidate = 180; // 3 minutos.

export default async function Home() {

  const professionals: any = await getProfessionalsRanked();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <Hero />
      </div>
      <Professionals professionals={professionals || []} />
      <Footer />
    </div>
  );
}