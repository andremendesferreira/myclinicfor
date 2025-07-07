"use server"

import { signIn } from "@/lib/auth";

export async function hgRegister(provider: string){
    await signIn(provider, { redirectTo: "/dashboard"})
}