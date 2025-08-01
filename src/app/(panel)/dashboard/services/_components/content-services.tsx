import { getUserServicesData } from '../_dta/get-all-services-user';
import { ServicesList } from './services-list'; 
import { verifyPermission } from '@/app/utils/permissions/verify-permission'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Banknote, BriefcaseBusiness } from "lucide-react";

interface ContentServicesProps{
    userId: string;
    name?: string;
}

export async function ContentServices({ userId, name }: ContentServicesProps){
    
    const services = await getUserServicesData({userId: userId});
    const permission = await verifyPermission({type:"service"})

    //console.log(permission)
    return(
        <>
            {permission.plan === null ? (

            <div className="mx-auto">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-x-0 pb-2">
                        <CardTitle className="flex flex-row items-center justify-items-start space-x-0 p-0">
                            <BriefcaseBusiness className="w-10 h-10 mr-4 text-emerald-500" />
                            <span className='text-3xl text-shadow-md lg:text-2xl'>Serviços</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <CardDescription className="flex flex-col items-center text-gray-700">
                            <div className="flex flex-row justify-center font-bold text-lg mb-4">
                                <Banknote className="text-emerald-500 mt-1 mr-3 w-7 h-7" aria-hidden="true" />
                                <span className="text-2xl">Defina um Plano</span>
                            </div>
                            <div className="flex flex-col items-start space-y-2 max-w-sm">
                                <p className="text-base">Olá <span className="font-semibold">{name}</span>!</p>
                                <p className="text-base text-left">
                                    Para melhor aproveitar nossos serviços, por favor, acesse o link abaixo e escolha um plano de ativação.
                                </p>
                            </div>
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-center mb-4">
                        <Link href="/dashboard/plans" passHref>
                            <Button className="bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 px-6 py-3 rounded shadow">
                                Ir para Planos
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            ) : (
                <ServicesList permission={permission} services={services || []} />
            )}
        </>
    )
}