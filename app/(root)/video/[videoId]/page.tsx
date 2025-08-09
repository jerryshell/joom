import VideoDetailHeader from "@/components/VideoDetailHeader";
import VideoPlayer from "@/components/VideoPlayer";
import { getVideoUrl } from "@/lib/actions/storage";
import { getVideo } from "@/lib/actions/video";
import { getServerClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

const VideoDetailPage = async ({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) => {
  const { videoId } = await params;

  const { data: video, error: videoError } = await getVideo({ id: videoId });
  if (!video) {
    console.error(videoError);
    redirect("/");
  }

  const serverClient = await getServerClient();

  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user && !video.is_public) {
    return redirect("/login");
  }

  const isOwner = !!user && video.user_id == user.id;

  if (!isOwner && !video.is_public) {
    redirect("/");
  }

  const { data: videoUrl, error: videoUrlError } = await getVideoUrl(
    video.file_path,
  );
  if (!videoUrl) {
    console.error(videoUrlError);
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col gap-9 pt-12.5 pb-20">
      <VideoDetailHeader video={video} isOwner={isOwner} />
      <section className="flex flex-col gap-7.5 lg:flex-row">
        <div className="flex w-full flex-col gap-6">
          <VideoPlayer videoUrl={videoUrl.signedUrl} />
        </div>
      </section>
    </main>
  );
};

export default VideoDetailPage;
