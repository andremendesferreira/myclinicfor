import { getUserServicesData } from '../_dta/get-all-services-user';
import { ServicesList } from './services-list'; 

interface ContentServicesProps{
    userId: string;
}


export async function ContentServices({ userId }: ContentServicesProps){
    
    const services = await getUserServicesData({userId: userId})

    return(
        <ServicesList services={services || []}/>
    )
}