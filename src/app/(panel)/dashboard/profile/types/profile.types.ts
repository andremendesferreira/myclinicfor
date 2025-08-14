// ==============================================
// 1. types/profile.types.ts
// ==============================================
import { Prisma } from '@/generated/prisma'

export type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

export interface ProfileContentProps {
  user: UserWithSubscription;
  activities: string[]
}

export interface WeekDay {
  id: number;
  name: string;
  short: string;
}