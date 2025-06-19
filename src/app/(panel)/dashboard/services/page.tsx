import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "../profile/_dta/get_info_user";
import { ContentServices } from "./_components/content-services";

export default async function Services(){
  const session = await getSession();

    if(!session){
      redirect("/");
    }

  const user = await getUserData({ userId: session.user?.id })

  if (!user) {
    redirect("/")
  }

  return (
      <ContentServices userId={session.user?.id} status={true}/>
  );
}