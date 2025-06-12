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
import { Menu } from "lucide-react";


export function Header() {

    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "#profissionais", label: "Profissionais" },
        { href: "/contato", label: "Contatos" },
    ]

    const NavLinks = () => (
        <>
            {navItems.map((item) => (
                <Button
                    onClick={() => setIsOpen(false)}
                    key={item.href}
                    asChild
                    variant="ghost"
                    className=" bg-transparent hover:bg-transparent"
                >
                    <Link 
                        className='text-zinc-900 hover:text-blue-950 font-semibold text-lg'
                        href={item.href}>
                        {item.label}
                    </Link>
                </Button>
            ))}
        </>
    );

  return (
    <header
        className="fixed top-0 right-0 left-0 w-full z-[999] bg-linear-to-r from-white via-blue-200 to-indigo-200 text-zinc-900 py-4 px-6 flex justify-between items-center"
        style={{ zIndex: 1000 }}
    >
        <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold">
                <span className="text-blue-950">MyClinic</span><span className="text-rose-600">FOR</span>
            </Link>
        </div>
      <nav className="hidden md:flex items-center font-semibold text-zinc-900 space-x-4">
        <NavLinks />
      </nav>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger 
            asChild
            className="md:hidden">
            <Button 
                variant="ghost"
                size="icon"
                className=" bg-blue-50 hover:bg-blue-100 text-zinc-900"
                aria-label="Abrir Menu"
            >
                <Menu className="size-7 text-zinc-900"/>
            </Button>
        </SheetTrigger>
        <SheetContent 
            side="right"
            className="w-[240px] md:w-[300px] z-[9999] bg-gradient-to-b from-white via-blue-100 to-indigo-200 text-zinc-900 text-shadow-zinc-900">
            <SheetHeader className="left-center">
                <SheetTitle 
                 className="font-bold text-zinc-900">
                    Menu   
                </SheetTitle>
                <SheetDescription 
                    className='text-gray-600 text-left text-sm'>
                    Acesse as opções disponíveis
                    <hr className='mt-1'/>
                </SheetDescription>
                <nav className='flex flex-col space-y-2 mt-4'>
                    <NavLinks />
                </nav>
            </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}