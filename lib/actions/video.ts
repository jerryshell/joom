"use server";

import {
  getServerClient,
  getServiceRoleClient,
} from "../supabase/serverClient";
import { redirect } from "next/navigation";

export async function createVideo({
  title,
  isPublic,
  filePath,
  duration,
  cover,
}: {
  title: string;
  isPublic: boolean;
  filePath: string;
  duration: number | null;
  cover: string | null;
}) {
  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const serviceRoleClient = getServiceRoleClient();

  const { data, error } = await serviceRoleClient
    .from("video")
    .insert({
      user_id: user.id,
      title: title,
      is_public: isPublic,
      file_path: filePath,
      duration: duration,
      cover: cover,
    })
    .select();

  return { data, error: error?.message };
}

export async function getVideo({ id }: { id: string }) {
  const serviceRoleClient = getServiceRoleClient();

  const { data, error } = await serviceRoleClient
    .from("video")
    .select("*, profile(*)")
    .eq("id", id)
    .single();

  return { data, error: error?.message };
}

export async function getPublicVideoList(filter?: { userId?: string }) {
  const serviceRoleClient = getServiceRoleClient();

  const query = serviceRoleClient
    .from("video")
    .select("*, profile(*)")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (filter?.userId) {
    query.eq("user_id", filter.userId);
  }

  const { data, error } = await query;

  return { data, error: error?.message };
}

export async function getMyVideoList() {
  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const serviceRoleClient = getServiceRoleClient();

  const query = serviceRoleClient
    .from("video")
    .select("*, profile(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  return { data, error: error?.message };
}

export async function updateVideoPublic({
  id,
  isPublic,
}: {
  id: string;
  isPublic: boolean;
}) {
  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const serviceRoleClient = getServiceRoleClient();

  const { error } = await serviceRoleClient
    .from("video")
    .update({ is_public: isPublic })
    .eq("id", id)
    .eq("user_id", user.id);

  return { error: error?.message };
}

export async function deleteVideo({ id }: { id: string }) {
  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const serviceRoleClient = getServiceRoleClient();

  const { data: video, error } = await serviceRoleClient
    .from("video")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (video) {
    await serviceRoleClient.storage.from("video").remove(video.file_path);
  }

  return { error: error?.message };
}
