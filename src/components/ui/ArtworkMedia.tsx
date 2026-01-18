import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Music } from 'lucide-react';

interface ArtworkMediaProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => void;
  loading?: 'lazy' | 'eager';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  fallbackSrc?: string;
}

/**
 * Unified media component that intelligently renders images, GIFs, or videos
 * based on the file extension of the source URL.
 * Handles null/undefined sources with a placeholder.
 */
export const ArtworkMedia: React.FC<ArtworkMediaProps> = ({
  src,
  alt,
  className,
  containerClassName,
  onLoad,
  onError,
  loading = 'lazy',
  autoPlay = true,
  loop = true,
  muted = true,
  fallbackSrc
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src || '');

  // Detect media type from URL
  const getMediaType = (url: string): 'video' | 'image' => {
    if (!url) return 'image';
    
    const lowercaseUrl = url.toLowerCase();
    
    // Check for video extensions
    if (lowercaseUrl.includes('.mp4') || 
        lowercaseUrl.includes('.webm') || 
        lowercaseUrl.includes('.mov') ||
        lowercaseUrl.includes('.ogg') ||
        lowercaseUrl.endsWith('mp4') ||
        lowercaseUrl.endsWith('webm') ||
        lowercaseUrl.endsWith('mov')) {
      return 'video';
    }
    
    // Default to image (includes .jpg, .png, .gif, .webp, etc.)
    return 'image';
  };

  const mediaType = getMediaType(currentSrc);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src || '');
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Handle video playback when it comes into view
  useEffect(() => {
    if (mediaType !== 'video' || !videoRef.current || !currentSrc) return;

    const video = videoRef.current;
    
    // Use Intersection Observer to play/pause based on visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoPlay) {
            video.play().catch(() => {
              // Silent fail - autoplay might be blocked
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [mediaType, autoPlay, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>) => {
    console.warn(`❌ ArtworkMedia: Failed to load ${mediaType}:`, currentSrc);
    
    // Try fallback if available and not already using it
    if (fallbackSrc && currentSrc !== fallbackSrc && !hasError) {
      console.log('🔄 ArtworkMedia: Trying fallback:', fallbackSrc);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      return;
    }
    
    setHasError(true);
    onError?.(e);
  };

  const baseClasses = cn(
    "w-full h-full object-cover absolute inset-0",
    !isLoaded && "opacity-0",
    isLoaded && "opacity-100 transition-opacity duration-300",
    className
  );

  // No source - show placeholder
  if (!currentSrc) {
    return (
      <div className={cn("relative overflow-hidden w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20", containerClassName)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Music className="w-8 h-8 text-muted-foreground/50" />
        </div>
      </div>
    );
  }

  if (mediaType === 'video') {
    return (
      <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
        {/* Loading placeholder - only show when not loaded */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-card/50 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        <video
          ref={videoRef}
          src={currentSrc}
          className={baseClasses}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onLoadedData={handleLoad}
          onError={handleError}
          aria-label={alt}
        />
      </div>
    );
  }

  // Image/GIF rendering
  return (
    <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      {/* Loading placeholder - only show when not loaded */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-card/50 flex items-center justify-center z-10">
          <div className="w-4 h-4 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
        </div>
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        className={baseClasses}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ArtworkMedia;
