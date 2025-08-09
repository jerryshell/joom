"use server";

import { getServiceRoleClient } from "../supabase/serverClient";

export async function getUploadUrl() {
  const serviceRoleClient = getServiceRoleClient();

  const { data, error } = await serviceRoleClient.storage
    .from("video")
    .createSignedUploadUrl(crypto.randomUUID());

  return { data, error: error?.message };
}

export async function getVideoUrl(path: string) {
  const serviceRoleClient = getServiceRoleClient();

  const { data, error } = await serviceRoleClient.storage
    .from("video")
    .createSignedUrl(path, 600);

  return { data, error: error?.message };
}
