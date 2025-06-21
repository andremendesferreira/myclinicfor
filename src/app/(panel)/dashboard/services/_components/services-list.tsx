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
import { Separator } from '@/components/ui/separator';
import { BriefcaseBusiness, Pencil, Plus, Trash, ToggleRight, ToggleLeft, Ban } from 'lucide-react';
import { DialogService } from './dialog-service';
import { Service } from '@/generated/prisma';
import { convertCentsToReal } from '@/app/utils/convertCurrency';
import { formatCurrecy } from '@/app/utils/formatCurrency';
import { deleteService, inativeService } from '../_act/delete-service';
 
interface ServicesListProps {
    services: Service[]
}



export function ServicesList({ services }: ServicesListProps){

    const [ isDialogOpen, setIsDialogOpen ] = useState(false);
    // Diálogo de autorização de remoção de serviço.
    const [ isAuthorizationDialogOpen, setIsAuthorizationDialogOpen ] = useState(false);
    function handleInactiveService(serviceId: string, status: boolean){
        inativeService({serviceId: serviceId, status: status});
    }
    function handleDeleteService(serviceId: string){
        deleteService({serviceId: serviceId});
    }

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
                            <div className="flex items-baseline justify-between max-h-[12px]">
                                <div>
                                    <span className="font-bold sm:text-sm md:text-lg lg:text-1xl">Detalhes dos serviços:</span>
                                </div>
                                <div className="flex flex-row font-semibold text-sm min-w-[160px]">
                                    <div className="h-4">
                                        <Separator 
                                            orientation='vertical'
                                            className="mr-3 mt-1"
                                        /></div>
                                    <div className="space-x-3">
                                        <span>Editar</span>
                                        <span>Ativar</span>
                                        <span>Excluir</span>
                                    </div>
                                </div>
                            </div>
                            <Separator className="m-3 p-0" />
                            {services.map(service => (
                                <article key={service.id}
                                         className="flex items-center justify-between"
                                >
                                    <div className="flex flex-col items-start min-w-[190px]">
                                        <span className="font-semibold break-words overflow-hidden">{service.name}</span>
                                        <span className="font-semibold text-zinc-600">{formatCurrecy(convertCentsToReal(service.price.toString()))}</span>
                                    </div>
                                    <div className="min-w-[155px]">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={()=>{}}
                                            className="ml-2 mr-1"
                                        >
                                            <Pencil className="w-4 h-4"/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={()=> handleInactiveService(service.id, service.status)}
                                            className="ml-2 mr-2"
                                        >
                                            { service.status ? 
                                                ( <ToggleRight className="w-4 h-4 text-green-500" />) :
                                                ( <ToggleLeft className="w-4 h-4 text-red-600" />)                                                 
                                            }
                                        </Button>
                                        <Dialog open={isAuthorizationDialogOpen} onOpenChange={setIsAuthorizationDialogOpen}>
                                            <DialogTrigger>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="ml-2 mr-2"
                                                >
                                                    <Trash className="w-4 h-4 text-red-700" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Exclusão de serviço</DialogTitle>
                                                    <DialogDescription>
                                                        Ao remover um serviço, ele será excluído da base de dados, assim como todas as suas referências e vínculos existentes.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex flex-row items-center justify-around space-x-4 py-4">
                                                    <div>
                                                        <Button
                                                            onClick={()=> {
                                                                handleDeleteService(service.id)
                                                                setIsAuthorizationDialogOpen(false)
                                                            }}
                                                            className="bg-red-700 hover:bg-red-600"
                                                        >
                                                            <Trash className="w-4 h4"/>
                                                            <span>Confirmar</span>
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            onClick={() => {setIsAuthorizationDialogOpen(false)}}
                                                            className="bg-green-700 hover:bg-green-600"
                                                        >
                                                            <Ban className="w-4 h4" />
                                                            <span>Cancelar</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>

                                        </Dialog>                                                
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