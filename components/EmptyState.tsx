import Image from "next/image";

const EmptyState = () => {
  return (
    <section className="border-gray-200 shadow-xl flex w-full flex-col items-center gap-6 rounded-2xl border px-4 py-10">
      <figure className="bg-sky-400 flex size-20 items-center justify-center rounded-2xl">
        <Image
          src="/assets/icons/video.svg"
          alt="icon"
          width={46}
          height={46}
        />
      </figure>
      <article className="flex flex-col items-center gap-1.5">
        <h1 className="text-neutral-800 text-2xl font-bold -tracking-[1px]">
          目前还没有视频可用
        </h1>
        <p className="text-sm font-normal -tracking-[0.5px] text-gray-400">
          视频上传后将在此处显示
        </p>
      </article>
    </section>
  );
};

export default EmptyState;
