import SharedHeader from "@/components/SharedHeader";
import VideoList from "@/components/VideoList";
import { getPublicVideoList } from "@/lib/actions/video";

const HomePage = async () => {
  const { data: videoList, error } = await getPublicVideoList();
  if (!videoList) {
    console.error(error);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col gap-9 pt-12.5 pb-20">
      <SharedHeader title="所有视频" subHeader="公开" />
      {videoList && <VideoList videoList={videoList} />}
    </main>
  );
};

export default HomePage;
