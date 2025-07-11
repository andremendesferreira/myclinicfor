"use client";
import { useState } from "react";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button"
import { LogIn, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { hgRegister } from "../_act/login"; 

export function Header() {

    const { data: session , status } = useSession();

    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "#profissionais", label: "Profissionais" },
        // { href: "/contato", label: "Contatos" },
    ]

    async function hgLogin(){
        await hgRegister("github")
    }

    const NavLinks = () => (
        <>
            {navItems.map((item) => (
                isOpen ? (
                    <Button
                        onClick={() => setIsOpen(false)}
                        key={item.href}
                        variant="ghost"
                        className=" bg-transparent hover:bg-transparent"
                    >
                        <Link 
                            className='text-zinc-900 hover:text-blue-900 text-sm font-semibold'
                            href={item.href}>
                            {item.label}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsOpen(false)}
                        key={item.href}
                        variant="ghost"
                        className=" bg-transparent hover:bg-transparent pt-4"
                    >
                        <Link 
                            className='text-zinc-900 hover:text-blue-900 text-base font-semibold'
                            href={item.href}>
                            {item.label}
                        </Link>
                    </Button>
                )
            ))}
            {status === 'loading' ? (
                <></>
            ) : (session && isOpen) ? (
                <div className='flex items-start justify-start'>
                    <Link
                        className='flex items-center justify-start
                        ml-4 gap-2 font-semibold whitespace-nowrap text-sm
                        bg-emerald-700 text-white hover:bg-emerald-600 shadow-zinc-100 
                        hover:shadow-sm rounded-sm py-1 pr-4 pl-4 pb-1'
                        href="/dashboard"
                    ><LogIn className="w-5 h-5"/>Acessar Portal</Link>
                </div>
            ) : (session && !isOpen) ? (
                <div className='flex items-start justify-start'>
                    <Link
                        className='flex items-center justify-start
                        ml-4 gap-2 font-semibold mt-1.5 text-base whitespace-nowrap
                        bg-emerald-800 text-white hover:bg-emerald-700 shadow-zinc-100 
                        hover:shadow-sm rounded-sm px-3 pb-1'
                        href="/dashboard"
                    ><LogIn className="w-6 h-6 pt-1"/><span className="pt-1">Acessar Portal</span></Link>
                </div>
            ): (!session && isOpen) ? (<div className="flex items-center justify-center w-full">
                    <Button 
                        onClick={hgLogin}
                        className="flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md ">
                        <LogIn />Acessar Portal
                    </Button>
                </div>
            ) :  (<div className="flex items-center justify-center w-full">
                    <Button 
                        onClick={hgLogin}
                        className="ml-3 flex items-center gap-3 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md">
                        <LogIn />Acessar Portal
                    </Button>
                </div>
            )}
        </>
    );
  return (
    <header
        className="fixed top-0 right-0 left-0 w-full z-[999] bg-linear-to-r from-white via-blue-200 to-indigo-200 text-zinc-900 py-4 px-6 flex justify-between items-center"
    >
        <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold">
                <span className="text-blue-950">MyClinic</span><span className="text-emerald-500">SOL</span>
            </Link>
        </div>
      <nav className="hidden md:flex items-start font-semibold text-zinc-900 space-x-4 text-base transition-all duration-300 ease-in-out">
        <NavLinks />
      </nav>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger 
            asChild
            className="md:hidden">
            <Button 
                variant="ghost"
                size="icon"
                className=" bg-blue-50 hover:bg-white text-zinc-900"
                aria-label="Abrir Menu"
            >
                <Menu className="size-6 text-zinc-900"/>
            </Button>
        </SheetTrigger>
        <SheetContent 
            side="right"
            className="w-[240px] md:w-[300px] z-[9999] bg-gradient-to-b from-white via-blue-100 to-indigo-200 text-zinc-900 text-shadow-zinc-900">
            <SheetHeader className="left-0 p-4 ">
                <SheetTitle 
                 className="font-bold text-zinc-900">
                    Menu   
                </SheetTitle>
                <SheetDescription 
                    className='text-gray-600 text-left text-sm mb-2'>
                    Acesse as opções disponíveis
                </SheetDescription>
                <nav className='flex flex-col items-start space-y-6 mt-2 text-sm transition-all duration-300 ease-in-out'>
                    <NavLinks />
                </nav>
            </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}