import Link from 'next/link';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"
import { Menu, LogIn } from "lucide-react";

export function Header() {
  return (
    <header
        className="fixed top-0 right-0 left-0 w-full z-[999] bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 text-zinc-900 py-4 px-6 flex justify-between items-center"
        style={{ zIndex: 1000 }}
    >
        <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold">
                <span className="text-blue-950">MyClinic</span><span className="text-rose-600">FOR</span>
            </Link>
        </div>
      <nav className="font-semibold">
        <a href="#" className="hidden md:flex items-center text-amber-50">Profissionais</a>
      </nav>
      <Sheet>
        <SheetTrigger 
            asChild
            className="md:hidden">
            <Button 
                variant="ghost"
                size="icon"
                className="hover:bg-transparent"
                aria-label="Abrir Menu"
            >
                <Menu className="size-7 text-black"/>
            </Button>
        </SheetTrigger>
        <SheetContent 
            side="right"
            className="w-[240px] md:w-[300px] z-[9999] bg-gradient-to-b from-cyan-100 via-blue-100 to-indigo-300 text-black">
            <SheetHeader className="left-center">
                <SheetTitle className="font-bold text-blue-950 mr-7">
                    Menu   
                </SheetTitle>
                <SheetDescription 
                    className='mt-2text-gray-900 text-center font-semibold'>
                    Acesse as opções disponíveis
                    <hr />
                </SheetDescription>
                <nav className="font-semibold">
                    <a href="#" className="text-blue-950 hover:text-rose-600"><span>Profissionais</span></a>
                </nav>
            </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}



// bg-gradient-to-b from-cyan-100 via-blue-300 to-indigo-400