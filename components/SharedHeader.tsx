"use client";

import RecordScreen from "./RecordScreen";
import Image from "next/image";
import Link from "next/link";

const SharedHeader = ({
  title,
  subHeader,
  userImg,
}: {
  title: string;
  subHeader: string;
  userImg?: string;
}) => {
  return (
    <header className="flex flex-col gap-9">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <figure className="flex items-center gap-2.5">
          {userImg && (
            <Image
              src={userImg}
              alt="user"
              width={66}
              height={66}
              className="rounded-full"
            />
          )}
          <article className="flex flex-col gap-1 -tracking-[0.8px]">
            <h1 className="text-neutral-800 text-3xl font-bold">{title}</h1>
            <p className="text-sm font-medium text-gray-400">{subHeader}</p>
          </article>
        </figure>
        <aside className="flex items-center gap-2 md:gap-4">
          <Link
            className="text-neutral-800 border-gray-200 flex items-center gap-2.5 rounded-4xl border px-5 py-2.5 text-sm font-semibold"
            href="/upload"
          >
            <Image
              src="/assets/icons/upload.svg"
              alt="upload"
              width={16}
              height={16}
            />
            <span className="truncate">上传视频</span>
          </Link>
          <RecordScreen />
        </aside>
      </section>
    </header>
  );
};

export default SharedHeader;
