"use client";

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <video
      className="h-full w-full object-contain bg-black"
      src={videoUrl}
      preload="none"
      controls
    />
  );
};

export default VideoPlayer;
