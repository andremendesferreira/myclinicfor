import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "./profile/_dta/get_info_user";
export default async function Dashboard(){
  const session = await getSession();

    if(!session){
      redirect("/");
    }

  const user = await getUserData({ userId: session.user?.id })

  if (!user) {
    redirect("/")
  }

  return (
    <div>
      <h1>Página Restrita - Portal</h1>
    </div>
  );
}