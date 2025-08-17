"use server"

import { signIn } from "@/lib/auth";

type Provider = "google" | "github";

export async function hgRegister(provider: Provider){
    await signIn(provider, { redirectTo: "/dashboard"})
}