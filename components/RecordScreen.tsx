"use client";

import { useScreenRecording } from "@/lib/hooks/useScreenRecording";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const RecordScreen = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    isRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useScreenRecording();

  const closeModal = () => {
    resetRecording();
    setIsOpen(false);
  };

  const handleStart = async () => {
    await startRecording();
  };

  const recordAgain = async () => {
    resetRecording();
    await startRecording();
    if (recordedVideoUrl && videoRef.current)
      videoRef.current.src = recordedVideoUrl;
  };

  const goToUpload = () => {
    if (!recordedBlob) {
      return;
    }
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem(
      "recordedVideo",
      JSON.stringify({
        url,
        name: "screen-recording.webm",
        type: recordedBlob.type,
        size: recordedBlob.size,
        duration: recordingDuration || 0,
      }),
    );
    router.push("/upload");
    closeModal();
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="py-2.5 px-5 flex items-center gap-2.5 text-sm font-semibold text-white bg-sky-400 rounded-4xl"
      >
        <Image
          src="/assets/icons/record.svg"
          alt="record"
          width={16}
          height={16}
        />
        <span className="truncate">录制视频</span>
      </button>

      {isOpen && (
        <section className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 backdrop-blur-xs"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl p-6 shadow-lg w-full max-w-lg z-10">
            <figure className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-neutral-800">屏幕录制</h3>
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={closeModal}
              >
                <Image
                  src="/assets/icons/close.svg"
                  alt="Close"
                  width={20}
                  height={20}
                />
              </button>
            </figure>

            <section className="w-full rounded-xl flex items-center justify-center overflow-hidden">
              {isRecording ? (
                <article className="flex flex-col items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-neutral-800 text-base font-medium">
                    正在录制中...
                  </span>
                </article>
              ) : recordedVideoUrl ? (
                <video
                  className="w-full h-full object-contain"
                  ref={videoRef}
                  src={recordedVideoUrl}
                  controls
                />
              ) : (
                <p className="text-base font-medium text-gray-400">
                  点击录制开始捕捉屏幕
                </p>
              )}
            </section>

            <div className="flex justify-center gap-4 mt-4">
              {!isRecording && !recordedVideoUrl && (
                <button
                  onClick={handleStart}
                  className="py-2.5 px-6 bg-sky-400 text-white rounded-4xl font-medium flex items-center gap-2"
                >
                  <Image
                    src="/assets/icons/record.svg"
                    alt="record"
                    width={16}
                    height={16}
                  />
                  录制
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="py-2.5 px-6 bg-red-400 text-white rounded-4xl font-medium flex items-center gap-2"
                >
                  <Image
                    src="/assets/icons/record.svg"
                    alt="record"
                    width={16}
                    height={16}
                  />
                  停止录制
                </button>
              )}
              {recordedVideoUrl && (
                <>
                  <button
                    onClick={recordAgain}
                    className="py-2.5 px-6 bg-neutral-400 text-white rounded-4xl font-medium"
                  >
                    重新录制
                  </button>
                  <button
                    onClick={goToUpload}
                    className="py-2.5 px-6 bg-sky-400 text-white rounded-4xl font-medium flex items-center gap-2"
                  >
                    <Image
                      className="brightness-0 invert"
                      src="/assets/icons/upload.svg"
                      alt="Upload"
                      width={16}
                      height={16}
                    />
                    上传视频
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecordScreen;
