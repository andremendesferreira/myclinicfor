"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardTitle,
    CardHeader
 } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reminder } from "@/generated/prisma";
import { MessageCircleWarning, Plus, Trash } from "lucide-react";
import { deleteRemider } from '../../_act/delete-reminder'
import { msgError, msgSuccess, msgInfo, msgWarning } from '@/components/custom-toast'
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import { ReminderContent } from './reminder-content'

interface ReminderListProps {
    reminder: Reminder[]
}

export function ReminderList({reminder}: ReminderListProps){
    //console.log("Lembretes encontrados: ", reminder)
    
    const router = useRouter();

     const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function handleDeleteReminder(id:string) {
        const response = await deleteRemider({reminderId:id});

        if(response.error){
            msgError(response.error)
            return;
        }

        msgSuccess(response.data || 'Lembrete removido com sucesso.');
        router.refresh();
    }

    return (
        <div className="flex flex-col">
            <Card className="pt-3 gap-3">
                <CardHeader className="flex flex-row items-center justify-between pl-6 pr-6 pb-0! mb-0!">
                    <CardTitle className="flex flex-row items-center justify-normal text-lg md:text-xl font-semibold">
                        <span className="pt-6 text-3xl md:text-2xl lg:text-lg">Lembretes</span>
                        <MessageCircleWarning className="lg:w-6 lg:h-6 md:w-8 md:h-8 w-10 h-10 text-amber-500" />
                    </CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="w-9 p-0 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200 hover:shadow-md text-white hover:text-white cursor-pointer">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Novo Lembrete</DialogTitle>
                            <DialogDescription>Registre um novo lembrete para sua lista.</DialogDescription>
                        </DialogHeader>
                        <ReminderContent
                            closeDialog={() => setIsDialogOpen(false)}
                        />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="m-0">
                    {reminder.length === 0 && (
                        <p className="text-sm md:text-base text-zinc-700">Nenhum lembrete registrado...</p>
                    )}
                    <ScrollArea className="h-[380px] lg:h-[480px] xl:h-[640px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
                        {reminder.map((item)=> (
                            <article
                                key={item.id}
                                className="flex flex-wrap flex-row items-center justify-between py-2 
                                        bg-amber-100 mb-2 px-2 rounded-md"
                            >
                                <div className='flex items-center justify-between w-full'>
                                    <p className="text-sm md:text-base">{item.description}</p>
                                    <Button
                                        className="w-6 h-6 p-2 rounded-full bg-red-600 shadow-red-950 shadow-sm hover:bg-red-500 hover:shadown-none! cursor-pointer"
                                        size="icon"
                                        onClick={() => handleDeleteReminder(item.id)}
                                    >
                                        <Trash className="p-0! m-0! w-4! h-4! text-white"/>
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}