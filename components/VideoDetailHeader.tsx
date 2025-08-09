"use client";

import { deleteVideo, updateVideoPublic } from "@/lib/actions/video";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const VideoDetailHeader = ({
  video,
  isOwner,
}: {
  video: any;
  isOwner: boolean;
}) => {
  const router = useRouter();
  const [showCopyCheck, setShowCopyCheck] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPublic, setIsPublic] = useState<boolean>(video.is_public);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/video/${video.id}`,
    );
    setShowCopyCheck(true);
    setTimeout(() => {
      setShowCopyCheck(false);
    }, 3000);
  };

  const handleDeleteBtnClick = () => {
    setIsDeleting(true);
    deleteVideo({ id: video.id })
      .catch(console.error)
      .finally(() => router.push("/"));
  };

  return (
    <header className="flex flex-col justify-between gap-5 md:flex-row">
      <aside className="flex flex-col gap-2.5">
        <h1 className="text-neutral-800 text-3xl font-bold">{video.title}</h1>
        <figure className="flex items-center gap-1">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-400">
            <Image
              src={video.profile.avatar_url}
              alt="user avatar"
              width={24}
              height={24}
            />
            <h2>{video.profile.name}</h2>
          </button>
          <figcaption className="flex items-center gap-1 text-sm font-semibold text-gray-400">
            <span>|</span>
            <p>{new Date(video.created_at).toLocaleString()}</p>
          </figcaption>
        </figure>
      </aside>
      <aside className="flex items-center gap-4">
        <button onClick={handleCopy}>
          <Image
            src={
              showCopyCheck
                ? "/assets/icons/checkmark.svg"
                : "/assets/icons/link.svg"
            }
            alt="Copy Link"
            width={24}
            height={24}
          />
        </button>
        {isOwner && (
          <div className="flex items-center gap-4">
            <button
              className="border-red-400 rounded-4xl border px-5 py-2.5 text-sm font-semibold text-red-400 disabled:cursor-not-allowed"
              disabled={isDeleting}
              onClick={handleDeleteBtnClick}
            >
              {isDeleting ? "删除中..." : "删除视频"}
            </button>
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="border-gray-200 flex items-center justify-between gap-2 rounded-2xl border px-4 py-2.5">
                  <div className="flex items-center gap-1">
                    <Image
                      src="/assets/icons/eye.svg"
                      alt="Views"
                      width={16}
                      height={16}
                      className="mt-0.5"
                    />
                    <p className="text-neutral-800 text-sm font-semibold capitalize">
                      {isPublic ? "公开" : "私密"}
                    </p>
                  </div>
                  <Image
                    src="/assets/icons/arrow-down.svg"
                    alt="Arrow Down"
                    width={16}
                    height={16}
                  />
                </div>
              </div>
              {isDropdownOpen && (
                <ul className="absolute top-12 z-10 flex w-full flex-col gap-2 rounded-lg bg-white shadow-lg">
                  <li
                    className="text-neutral-800 relative cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium -tracking-[0.8px] transition-colors duration-200 ease-in-out hover:bg-sky-400 hover:text-white"
                    onClick={() => {
                      setIsPublic(true);
                      updateVideoPublic({
                        id: video.id,
                        isPublic: true,
                      }).catch(console.error);
                      setIsDropdownOpen(false);
                    }}
                  >
                    公开
                  </li>
                  <li
                    className="text-neutral-800 relative cursor-pointer rounded-md px-3 py-2.5 text-sm font-medium -tracking-[0.8px] transition-colors duration-200 ease-in-out hover:bg-sky-400 hover:text-white"
                    onClick={() => {
                      setIsPublic(false);
                      updateVideoPublic({
                        id: video.id,
                        isPublic: false,
                      }).catch(console.error);
                      setIsDropdownOpen(false);
                    }}
                  >
                    私密
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
      </aside>
    </header>
  );
};

export default VideoDetailHeader;
