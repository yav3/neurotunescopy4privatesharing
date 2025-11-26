import React, { useEffect, useRef } from 'react';

interface PageBackgroundMediaProps {
  videoSrc?: string;
  gifSrc?: string;
  opacity?: number;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const PageBackgroundMedia: React.FC<PageBackgroundMediaProps> = ({
  videoSrc,
  gifSrc,
  opacity = 1,
  overlay = true,
  overlayOpacity = 0.5,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc) {
      video.muted = true;
      video.volume = 0;
      const playPromise = video.play();
      if (playPromise && (playPromise as any).catch) {
        (playPromise as Promise<void>).catch(() => {});
      }
    }
  }, [videoSrc]);

  if (!videoSrc && !gifSrc) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {videoSrc && (
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          loop
          className="w-full h-full object-cover"
          style={{ opacity }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      {gifSrc && !videoSrc && (
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${gifSrc})`,
            opacity,
          }}
        />
      )}
      {overlay && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  );
};
