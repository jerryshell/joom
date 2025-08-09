"use client";

import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import Image from "next/image";
import { useEffect, useState } from "react";

const VideoList = ({ videoList }: { videoList: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVideoList, setFilterVideoList] = useState(videoList);

  useEffect(() => {
    setFilterVideoList(() =>
      videoList.filter((item) => item.title.includes(searchTerm)),
    );
  }, [searchTerm, videoList]);

  return (
    <>
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="relative w-full max-w-[500px]">
          <input
            className="border-gray-200 text-neutral-800 w-full rounded-2xl border py-2 pr-5 pl-8 text-sm font-normal placeholder:text-gray-400 focus:outline-sky-400"
            type="text"
            placeholder="搜索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Image
            className="absolute top-1/2 left-3 -translate-y-1/2"
            src="/assets/icons/search.svg"
            alt="search"
            width={16}
            height={16}
          />
        </div>
      </section>

      {filterVideoList.length > 0 ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filterVideoList.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              userId={video.user_id}
              title={video.title}
              cover={video.cover}
              avatar={video.profile.avatar_url}
              username={video.profile.name}
              createdAt={new Date(video.created_at)}
              isPublic={video.is_public}
              duration={video.duration}
            />
          ))}
        </section>
      ) : (
        <EmptyState />
      )}
    </>
  );
};

export default VideoList;
