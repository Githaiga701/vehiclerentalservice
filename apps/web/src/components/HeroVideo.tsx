"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export default function HeroVideo({
  src = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761",
  poster = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1920",
  className,
  autoPlay = true,
  muted = true,
  loop = true
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        {/* Fallback image */}
        <img 
          src={poster} 
          alt="Video preview" 
          className="w-full h-full object-cover"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full w-12 h-12 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          className="rounded-full w-12 h-12 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </Button>
      </div>

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-full w-20 h-20 p-0 bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 group"
            onClick={togglePlay}
          >
            <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      )}
    </div>
  );
}