import { useState, useRef, useEffect } from "react";

export const DEFAULT_VIDEO_CONFIG = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { ideal: 30 },
};

export const DEFAULT_RECORDING_CONFIG = {
  mimeType: "video/webm;codecs=vp8,opus",
  audioBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
};

interface RecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedVideoUrl: string;
  recordingDuration: number;
}

interface ExtendedMediaStream extends MediaStream {
  _originalStreams?: MediaStream[];
}

const createRecordingBlob = (chunks: Blob[]): { blob: Blob; url: string } => {
  const blob = new Blob(chunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);
  return { blob, url };
};

export const calculateRecordingDuration = (startTime: number | null): number =>
  startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

interface MediaStreams {
  displayStream: MediaStream;
  micStream: MediaStream | null;
  hasDisplayAudio: boolean;
}

const getMediaStreams = async (withMic: boolean): Promise<MediaStreams> => {
  const displayStream = await navigator.mediaDevices.getDisplayMedia({
    video: DEFAULT_VIDEO_CONFIG,
    audio: true,
  });

  const hasDisplayAudio = displayStream.getAudioTracks().length > 0;
  let micStream: MediaStream | null = null;

  if (withMic) {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream
      .getAudioTracks()
      .forEach((track: MediaStreamTrack) => (track.enabled = true));
  }

  return { displayStream, micStream, hasDisplayAudio };
};

const createAudioMixer = (
  ctx: AudioContext,
  displayStream: MediaStream,
  micStream: MediaStream | null,
  hasDisplayAudio: boolean,
) => {
  if (!hasDisplayAudio && !micStream) return null;

  const destination = ctx.createMediaStreamDestination();
  const mix = (stream: MediaStream, gainValue: number) => {
    const source = ctx.createMediaStreamSource(stream);
    const gain = ctx.createGain();
    gain.gain.value = gainValue;
    source.connect(gain).connect(destination);
  };

  if (hasDisplayAudio) mix(displayStream, 0.7);
  if (micStream) mix(micStream, 1.5);

  return destination;
};

interface RecordingHandlers {
  onDataAvailable: (e: BlobEvent) => void;
  onStop: () => void;
}

const setupRecording = (
  stream: MediaStream,
  handlers: RecordingHandlers,
): MediaRecorder => {
  const recorder = new MediaRecorder(stream, DEFAULT_RECORDING_CONFIG);
  recorder.ondataavailable = handlers.onDataAvailable;
  recorder.onstop = handlers.onStop;
  return recorder;
};

const cleanupRecording = (
  recorder: MediaRecorder | null,
  stream: MediaStream | null,
  originalStreams: MediaStream[] = [],
) => {
  if (recorder?.state !== "inactive") {
    recorder?.stop();
  }

  stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
  originalStreams.forEach((s) =>
    s.getTracks().forEach((track: MediaStreamTrack) => track.stop()),
  );
};

export const useScreenRecording = () => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    recordedBlob: null,
    recordedVideoUrl: "",
    recordingDuration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<ExtendedMediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (state.recordedVideoUrl) {
        URL.revokeObjectURL(state.recordedVideoUrl);
      }
      if (audioContextRef.current?.state !== "closed") {
        audioContextRef.current?.close().catch(console.error);
      }
    };
  }, [state.recordedVideoUrl]);

  const handleRecordingStop = () => {
    const { blob, url } = createRecordingBlob(chunksRef.current);
    const duration = calculateRecordingDuration(startTimeRef.current);

    setState((prev) => ({
      ...prev,
      recordedBlob: blob,
      recordedVideoUrl: url,
      recordingDuration: duration,
      isRecording: false,
    }));
  };

  const startRecording = async (withMic = true) => {
    try {
      stopRecording();

      const { displayStream, micStream, hasDisplayAudio } =
        await getMediaStreams(withMic);
      const combinedStream = new MediaStream() as ExtendedMediaStream;

      displayStream
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

      audioContextRef.current = new AudioContext();
      const audioDestination = createAudioMixer(
        audioContextRef.current,
        displayStream,
        micStream,
        hasDisplayAudio,
      );

      audioDestination?.stream
        .getAudioTracks()
        .forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

      combinedStream._originalStreams = [
        displayStream,
        ...(micStream ? [micStream] : []),
      ];
      streamRef.current = combinedStream;

      mediaRecorderRef.current = setupRecording(combinedStream, {
        onDataAvailable: (e) => e.data.size && chunksRef.current.push(e.data),
        onStop: handleRecordingStop,
      });

      chunksRef.current = [];
      startTimeRef.current = Date.now();
      mediaRecorderRef.current.start(1000);
      setState((prev) => ({ ...prev, isRecording: true }));
      return true;
    } catch (error) {
      console.error("Recording error:", error);
      return false;
    }
  };

  const stopRecording = () => {
    cleanupRecording(
      mediaRecorderRef.current,
      streamRef.current,
      streamRef.current?._originalStreams,
    );
    streamRef.current = null;
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  const resetRecording = () => {
    stopRecording();
    if (state.recordedVideoUrl) {
      URL.revokeObjectURL(state.recordedVideoUrl);
    }
    setState({
      isRecording: false,
      recordedBlob: null,
      recordedVideoUrl: "",
      recordingDuration: 0,
    });
    startTimeRef.current = null;
  };

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
