"use client"

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

interface ReminderListProps {
    reminder: Reminder[]
}

export function ReminderList({reminder}: ReminderListProps){
    //console.log("Lembretes encontrados: ", reminder)
    
    const router = useRouter();

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
                        <span className="pt-6">Lembretes</span>
                        <MessageCircleWarning className="w-6 h-6 text-amber-500" />
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-3 mt-5"
                    >
                        <Plus className="w-4! h-4!"/>
                    </Button>
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
                                <p className="text-sm md:text-base">{item.description}</p>
                                <Button
                                    className="w-8 h-8 p-2 rounded-full bg-red-600 shadow-red-950 shadow-sm hover:bg-red-500 hover:shadown-none!"
                                    size="sm"
                                    onClick={() => handleDeleteReminder(item.id)}
                                >
                                    <Trash className="p-0! m-0! w-4! h-4! text-white"/>
                                </Button>
                            </article>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}