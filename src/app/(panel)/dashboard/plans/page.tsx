import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";
export default function Plans(){
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
        <LifeLine color="#3191cc" size="medium" text="" textColor="" />
      </div>
    }>
    <div>
      <h1>Página Restrita - Planos de assinatura</h1>
    </div>
  </Suspense>
);
}