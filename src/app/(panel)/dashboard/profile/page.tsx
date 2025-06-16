import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_dta/get_info_user"
import { ProfileContent } from "./_components/profile";

  const session = await getSession();

  if(!session){
    redirect("/")
  }

  const user = await getUserData(session.user.id);

  if (!user) {
    redirect("/")
  }

export default function Profile(){
  return (
    <ProfileContent />
  )
}