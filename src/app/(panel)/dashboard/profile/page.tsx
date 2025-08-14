import getSesion from '@/lib/getSession'
import { redirect } from 'next/navigation'
import { getUserData } from './_dta/get_info_user'
import { ProfileContent } from './_components/profile-component'
import { Suspense } from "react";
import { LifeLine } from "react-loading-indicators";
import { getActivitiesData } from './_dta/get_activities';


interface ActivitiesProps {
  activities: string[]; // Array de Activities
}

export default async function Profile() {
  const session = await getSesion()

  if (!session) {
    redirect("/")
  }

  const user = await getUserData({ userId: session.user?.id })

  if (!user) {
    redirect("/")
  }

  const activities = await getActivitiesData();

  if (!activities && activities === null){
    redirect("/")
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[404px] lg:h-[504px] xl:h-[664px] lg:max-h-[calc(100vh-15rem)] pr-3 w-full flex-1">
        <LifeLine color="#3191cc" size="medium" text="" textColor="" />
      </div>
    }>
      <ProfileContent user={user} activities={activities}/>
    </Suspense>
  )
}