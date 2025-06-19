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
import { BriefcaseBusiness, Plus } from 'lucide-react';
import { DialogService } from './dialog-service'

export function ServicesList(){

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
                            <DialogService />
                        </DialogContent>
                    </CardHeader>
                </Card>
            </section>
        </Dialog>
    )
}