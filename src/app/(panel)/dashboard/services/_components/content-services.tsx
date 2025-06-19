import { getUserServicesData } from '../_dta/get-all-services-user';
import { ServicesList } from './services-list'; 

interface ContentServicesProps{
    userId: string;
    status: boolean | true;
}


export async function ContentServices({ userId, status }: ContentServicesProps){

    const services = await getUserServicesData({userId: userId, status: status})

    return(
        <ServicesList />
    )
}