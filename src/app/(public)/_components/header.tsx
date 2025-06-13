"use client";
import { useState } from 'react';
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
import { LogIn, Menu } from "lucide-react";
// import { Separator } from '@radix-ui/react-separator';

export function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const session = false; // Simulating session state, replace with actual session logic

    const navItems = [
        { href: "#profissionais", label: "Profissionais" },
        // { href: "/contato", label: "Contatos" },
    ]

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
                            className='text-zinc-900 hover:text-blue-900 text-sm'
                            href={item.href}>
                            {item.label}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        onClick={() => setIsOpen(false)}
                        key={item.href}
                        variant="ghost"
                        className=" bg-transparent hover:bg-transparent"
                    >
                        <Link 
                            className='text-zinc-900 hover:text-blue-900 text-base'
                            href={item.href}>
                            {item.label}
                        </Link>
                    </Button>
                )
            ))}
            {(session && isOpen) ? (
                <div className='flex items-start justify-start'>
                    <Link
                    className='ml-4 gap-2 text-zinc-900 hover:text-blue-900 font-semibold mt-1.5 whitespace-nowrap text-sm'
                        href="/dashboard"
                    >Acessar MyClinic</Link>
                </div>
            ) : (session && !isOpen) ? (
                <div className='flex items-start justify-start'>
                    <Link
                    className='ml-4 gap-2 text-zinc-900 hover:text-blue-900 font-semibold mt-1.5 text-base whitespace-nowrap'
                        href="/dashboard"
                    >Acessar MyClinic</Link>
                </div>
            ): (!session && isOpen) ? (<div className="flex items-center justify-center w-full">
                    <Button 
                        onClick={() => setIsOpen(false)}
                        className="mt-4 flex items-center gap-2 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md">
                        <LogIn />
                        Portal MyClinic
                    </Button>
                </div>
            ) :  (<div className="flex items-center justify-center w-full">
                    <Link href="/login">
                        <Button 
                            className="ml-4 flex items-center gap-3 bg-blue-900 text-white hover:bg-blue-800 shadow-blue-200 hover:shadow-md">
                            <LogIn />
                            Portal MyClinic
                        </Button>
                    </Link>
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
                <span className="text-blue-950">MyClinic</span><span className="text-emerald-500">FOR</span>
            </Link>
        </div>
      <nav className="hidden md:flex items-start font-semibold text-zinc-900 space-x-4 text-base">
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
                <Menu className="size-7 text-zinc-900"/>
            </Button>
        </SheetTrigger>
        <SheetContent 
            side="right"
            className="w-[240px] md:w-[300px] z-[9999] bg-gradient-to-b from-white via-blue-100 to-indigo-200 text-zinc-900 text-shadow-zinc-900">
            <SheetHeader className="left-0 p-4 space-y-2">
                <SheetTitle 
                 className="font-bold text-zinc-900">
                    Menu   
                </SheetTitle>
                <SheetDescription 
                    className='text-gray-600 text-left text-sm'>
                    Acesse as opções disponíveis
                </SheetDescription>
                <nav className='flex flex-col items-start space-y-2 mt-4 text-sm'>
                    <NavLinks />
                </nav>
            </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}