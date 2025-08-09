"use server";

import { getServiceRoleClient } from "../supabase/serverClient";

export async function getProfile(id: string) {
  const serviceRoleClinet = getServiceRoleClient();

  const { data, error } = await serviceRoleClinet
    .from("profile")
    .select()
    .eq("id", id)
    .single();

  return { data, error: error?.message };
}
