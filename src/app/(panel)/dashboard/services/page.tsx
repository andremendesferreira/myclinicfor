import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "../profile/_dta/get_info_user";
import { ContentServices } from "./_components/content-services";
import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";

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
      <Suspense fallback={
        <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
          <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        </div>
      }>
          <ContentServices userId={session.user?.id} name={session.user?.name} />
      </Suspense>
  );
}