import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Profissionais } from "./_components/profissionais";
import { Footer } from "./_components/footer";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>
        <Hero />
      </div>
      <Profissionais />
      <Footer />
    </div>
  );
}