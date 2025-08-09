"use client";

import { getUploadUrl } from "@/lib/actions/storage";
import { createVideo } from "@/lib/actions/video";
import { useVideoFileInput } from "@/lib/hooks/useFileInput";
import { getBrowserClient } from "@/lib/supabase/browserClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect, ChangeEvent } from "react";

// 50 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const UploadPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(new Date().toLocaleString());
  const [isPublic, setIsPublic] = useState(false);
  const videoFileInput = useVideoFileInput(MAX_VIDEO_SIZE);
  const browserClinet = getBrowserClient();

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) {
          return;
        }

        const { url, name, type } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (videoFileInput.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          videoFileInput.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          videoFileInput.inputRef.current.dispatchEvent(event);

          videoFileInput.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error(e);
      }
    };

    checkForRecordedVideo();
  }, [videoFileInput]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (title.trim().length <= 0) {
        setError("请输入标题");
        setIsSubmitting(false);
        return;
      }
      if (!videoFileInput.file) {
        setError("请上传视频");
        setIsSubmitting(false);
        return;
      }

      const uploadUrlResponse = await getUploadUrl();
      if (!uploadUrlResponse.data) {
        console.error(uploadUrlResponse.error);
        setError("获取上传 URL 失败");
        setIsSubmitting(false);
        return;
      }

      const uploadResponse = await browserClinet.storage
        .from("video")
        .uploadToSignedUrl(
          uploadUrlResponse.data.path,
          uploadUrlResponse.data.token,
          videoFileInput.file,
        );
      if (!uploadResponse.data) {
        console.error(uploadResponse.error);
        setError("获取上传失败");
        setIsSubmitting(false);
        return;
      }

      const response = await createVideo({
        title,
        isPublic,
        filePath: uploadResponse.data.path,
        duration: videoFileInput.duration,
        cover: videoFileInput.coverBase64,
      });
      if (!response.data) {
        console.error(response.error);
        setError("创建视频记录失败");
        setIsSubmitting(false);
        return;
      }

      router.push(`/video/${response.data[0].id}`);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 flex flex-col gap-7.5 pt-12.5 pb-20">
      <h1 className="text-neutral-800 text-3xl font-bold">上传视频</h1>
      {error && (
        <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-600">
          {error}
        </div>
      )}
      <form
        className="rounded-xl gap-6 w-full flex flex-col shadow-xl px-5 py-7.5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label
            className="text-base font-medium text-gray-400"
            htmlFor="title"
          >
            标题
          </label>
          <input
            className="border-gray-200 rounded-xl text-neutral-800 border px-4.5 py-2.5 text-base font-semibold placeholder:font-medium placeholder:text-gray-400 focus:outline-sky-400"
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="清晰简洁的视频标题"
          />
        </div>

        <section className="flex flex-col gap-2">
          <label
            className="text-base font-medium text-gray-400"
            htmlFor="video"
          >
            视频
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            hidden
            ref={videoFileInput.inputRef}
            onChange={videoFileInput.handleFileChange}
          />
          {videoFileInput.objectUrl ? (
            <div className="rounded-xl relative h-64 w-full overflow-hidden">
              <video
                className="h-full w-full object-contain"
                src={videoFileInput.objectUrl}
                controls
              />
              <button
                className="bg-gray-200 absolute top-2 right-2 cursor-pointer rounded-full p-2 text-white opacity-90 hover:opacity-100"
                type="button"
                onClick={videoFileInput.resetFile}
              >
                <Image
                  className="object-contain"
                  src="/assets/icons/close.svg"
                  alt="Close Icon"
                  width={16}
                  height={16}
                />
              </button>
              <p className="bg-neutral-800 absolute opacity-50 top-0 left-0 truncate px-3 py-1 text-sm text-white">
                {videoFileInput.file?.name}
              </p>
            </div>
          ) : (
            <figure
              className="border-gray-200 rounded-xl flex h-40 w-full cursor-pointer items-center justify-center gap-2.5 border px-3.5 py-1.5 text-gray-400"
              onClick={() => videoFileInput.inputRef.current?.click()}
            >
              <Image
                src="/assets/icons/upload.svg"
                alt="Upload Icon"
                width={24}
                height={24}
              />
              <p className="text-neutral-800 text-base font-medium">
                点击上传视频
              </p>
            </figure>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <label
            className="text-base font-medium text-gray-400"
            htmlFor="visibility"
          >
            可见性
          </label>
          <select
            className="border-gray-200 rounded-xl text-neutral-800 border px-4.5 py-2.5 text-base font-semibold placeholder:font-medium placeholder:text-gray-400 focus:outline-sky-400"
            id="visibility"
            name="visibility"
            value={isPublic ? "public" : "private"}
            onChange={(e) => setIsPublic(e.target.value == "public")}
          >
            <option value="public">公开：视频将会展示在公开页面中</option>
            <option value="private">私密：视频不会展示在公开页面中</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-4xl bg-sky-400 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "上传中..." : "上传"}
        </button>
      </form>
    </main>
  );
};

export default UploadPage;
