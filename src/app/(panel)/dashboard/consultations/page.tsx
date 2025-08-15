import getSession from "@/lib/getSession";
import { redirect } from "next/navigation"
import { getUserData } from "../profile/_dta/get_info_user";
import Link from "next/link";
import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";
import { LabelSubscription } from "@/components/ui/label-subscription";
import { verifyPermission } from "@/app/utils/permissions/verify-permission";

export default async function Dashboard(){
  const session = await getSession();

    if(!session){
      redirect("/");
    }

  const user = await getUserData({ userId: session.user?.id })
  const permission = await verifyPermission({ type: "service" });

  if (!user) {
    redirect("/")
  }

  const urlLink = `${process.env.NEXT_PUBLIC_URL}/clinic/${user.id}`

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
        <LifeLine color="#3191cc" size="medium" text="" textColor="" />
        <div className="flex flex-row items-center justify-between w-full">
          {!permission.hasPermission && (
            <LabelSubscription expired={permission.expired} />
          )}
        </div>
      </div>
    }>
      <main>
        <section className="grid grid-col-1 gap-4 lg:grid-cols-2 mt-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Consultas</h1>
        </section>
      </main>
    </Suspense>
  );
}