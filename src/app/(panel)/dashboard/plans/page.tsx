
import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";
import getSesion from '@/lib/getSession';
import { redirect } from 'next/navigation';
import { getSubscription } from '../_dta/get-subscription';
import { GridPlans } from './_components/grid-plans';
import { Banknote } from "lucide-react";
import { Plan } from "@/generated/prisma";

export default async function Plans(){

  const session = await getSesion()

  if (!session) {
    redirect("/")
  }

  const subscription = await getSubscription({ userId: session.user?.id })
  const actualPlan: Plan | undefined = Array.isArray(subscription) ? undefined : subscription?.plan;
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
        <LifeLine color="#3191cc" size="medium" text="" textColor="" />
      </div>
    }>
    <article className="flex flex-col py-4 bg-white rounded-lg shadow-md">
      <div className='flex items-center-safe justify-self-auto ' >
        <Banknote className="ml-4 w-10 h-10 mr-4 text-emerald-500"/>
        <span className='text-3xl text-shadow-md lg:text-2xl font-semibold'> Planos</span>
      </div>
      <p className="text-gray-600 text-sm px-4">
        Escolha o plano de assinatura mensal, que melhor se adapta às suas necessidades.
      </p>
      <GridPlans actualPlan={actualPlan} />
    </article>
  </Suspense>
);
}