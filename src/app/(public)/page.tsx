import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <h1>Bem-vindo ao MyClinicFOR</h1>
        <p>Esta é a página pública do aplicativo.</p>
      </main>
      <Footer />
    </div>
  );
}