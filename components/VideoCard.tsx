"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const VideoCard = ({
  id,
  userId,
  title,
  cover,
  avatar,
  username,
  createdAt,
  isPublic,
  duration,
}: {
  id: string;
  userId: string;
  title: string;
  cover: string;
  avatar: string;
  username: string;
  createdAt: Date;
  isPublic: boolean;
  duration: number | null;
}) => {
  const [showCopyCheck, setShowCopyCheck] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
    setShowCopyCheck(true);
    setTimeout(() => {
      setShowCopyCheck(false);
    }, 3000);
  };

  return (
    <div className="border-gray-200 relative flex aspect-[16/9] w-full flex-col rounded-2xl border hover:shadow-lg transition">
      <Link href={`/video/${id}`}>
        <Image
          src={cover}
          width={290}
          height={160}
          alt="thumbnail"
          className="h-[190px] w-full rounded-t-2xl object-cover"
        />
      </Link>
      <article className="flex flex-col gap-3 rounded-b-2xl px-3.5 pt-4 pb-4.5">
        <div className="flex justify-between gap-2">
          <Link
            href={`/profile/${userId}`}
            className="flex items-center gap-1.5"
          >
            <Image
              src={avatar}
              width={34}
              height={34}
              alt="avatar"
              className="rounded-full aspect-square"
            />
            <figcaption className="flex flex-col gap-0.5">
              <h3 className="text-neutral-800 text-xs font-semibold">
                {username}
              </h3>
              <p className="text-xs font-normal text-gray-400 capitalize">
                {isPublic ? "公开" : "私密"}
              </p>
            </figcaption>
          </Link>
        </div>
        <h2 className="text-neutral-800 truncate text-base font-semibold">
          {title}
        </h2>
        <span className="text-sm text-gray-400">
          {createdAt.toLocaleString()}
        </span>
      </article>
      {isPublic && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-white shadow-md transition duration-200 hover:shadow-lg"
        >
          <Image
            src={
              showCopyCheck
                ? "/assets/icons/checkmark.svg"
                : "/assets/icons/link.svg"
            }
            alt="Copy Link"
            width={18}
            height={18}
          />
        </button>
      )}
      {duration && (
        <div className="bg-neutral-800 absolute top-40 right-2 rounded-full px-2.5 py-1 text-xs font-medium text-white">
          {Math.ceil(duration / 60)}min
        </div>
      )}
    </div>
  );
};

export default VideoCard;
