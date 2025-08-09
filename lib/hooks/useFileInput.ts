import { ChangeEvent, useRef, useState } from "react";

export const useVideoFileInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    const selectedFile = e.target.files[0];
    if (selectedFile.size > maxSize) {
      return;
    }

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setObjectUrl(objectUrl);

    if (videoRef.current) {
      const video = videoRef.current;
      video.onloadedmetadata = null;
      video.onseeked = null;
      video.onerror = null;
      videoRef.current = null;
    }

    const videoElement = document.createElement("video");
    videoRef.current = videoElement;
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      if (isFinite(videoElement.duration) && videoElement.duration > 0) {
        setDuration(Math.round(videoElement.duration));
        videoElement.currentTime = Math.round(videoElement.duration / 2);
      } else {
        setDuration(null);
      }
    };

    videoElement.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 180;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);
        setCoverBase64(base64);
      }
    };

    videoElement.onerror = () => {
      console.error("视频加载失败");
    };

    videoElement.src = objectUrl;
  };

  const resetFile = () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    if (videoRef.current) {
      const video = videoRef.current;
      video.onloadedmetadata = null;
      video.onseeked = null;
      video.onerror = null;
      videoRef.current = null;
    }

    setFile(null);
    setObjectUrl(null);
    setDuration(null);
    setCoverBase64(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    file,
    objectUrl,
    duration,
    coverBase64,
    inputRef,
    handleFileChange,
    resetFile,
  };
};
