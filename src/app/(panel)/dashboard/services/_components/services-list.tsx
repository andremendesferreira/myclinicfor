"use client"
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BriefcaseBusiness, Pencil, Plus, X } from 'lucide-react';
import { DialogService } from './dialog-service';
import { Service } from '@/generated/prisma';
import { convertCentsToReal } from '@/app/utils/convertCurrency';
import { formatCurrecy } from '@/app/utils/formatCurrency';
 
interface ServicesListProps {
    services: Service[]
}



export function ServicesList({ services }: ServicesListProps){

    const [isDialogOpen, setIsDialogOpen ] = useState(false)

    return(
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <section className="mx-auto">
                <Card >
                    <CardHeader className="flex flex-row items-center justify-between space-x-0 pb-2">
                        <CardTitle className="flex flex-row items-center justify-items-start space-x-0 p-0">
                            <BriefcaseBusiness className="w-10 h-10 mr-4 text-emerald-500"/>
                            <span className='text-3xl text-shadow-md lg:text-2xl'> Serviços</span>
                        </CardTitle>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-700 text-white hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200">
                                <Plus className="w-4 h-4 "/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogService 
                                closeModal={() => {
                                    setIsDialogOpen(false)
                                }}
                            />
                        </DialogContent>
                    </CardHeader>
                    <CardContent>
                        <section className="space-y-4 ">
                            {services.map(service => (
                                <article key={service.id}
                                         className="flex items-center justify-between"
                                >
                                    <div className="flex items-center justify-between space-x-2">
                                        <span className="font-semibold">{service.name}</span>
                                        <span> - </span>
                                        <span className="font-semibold text-zinc-600">{formatCurrecy(convertCentsToReal(service.price.toString()))}</span>
                                    </div>
                                    <div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={()=>{}}
                                        >
                                            <Pencil className="w-4 h-4"/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={()=>{}}
                                        >
                                            <X className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </CardContent>
                </Card>
            </section>
        </Dialog>
    )
}