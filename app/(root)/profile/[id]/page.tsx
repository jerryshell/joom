import SharedHeader from "@/components/SharedHeader";
import VideoList from "@/components/VideoList";
import { getProfile } from "@/lib/actions/profile";
import { getMyVideoList, getPublicVideoList } from "@/lib/actions/video";
import { getServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: profile, error: profileError } = await getProfile(id);
  if (!profile) {
    console.error(profileError);
    return redirect("/");
  }

  const { data: videoList, error: myVideoListError } =
    user.id == id
      ? await getMyVideoList()
      : await getPublicVideoList({ userId: id });
  if (!profile) {
    console.error(myVideoListError);
    return redirect("/");
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col gap-9 pt-12.5 pb-20">
      <SharedHeader
        title={profile.name}
        subHeader={profile.email}
        userImg={profile.avatar_url}
      />
      {videoList && <VideoList videoList={videoList} />}
    </main>
  );
};

export default ProfilePage;
