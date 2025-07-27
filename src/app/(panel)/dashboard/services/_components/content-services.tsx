import { getUserServicesData } from '../_dta/get-all-services-user';
import { ServicesList } from './services-list'; 
import { verifyPermission } from '@/app/utils/permissions/verify-permission'

interface ContentServicesProps{
    userId: string;
}


export async function ContentServices({ userId }: ContentServicesProps){
    
    const services = await getUserServicesData({userId: userId});
    const permission = await verifyPermission({type:"service"})

    return(
        <ServicesList permission={permission} services={services || []}/>
    )
}