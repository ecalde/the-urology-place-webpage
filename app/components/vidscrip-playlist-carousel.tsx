"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Link from "next/link";
import { BTN_ICON_SECONDARY } from "@/app/lib/button-styles";
import {
  REZUM_VIDSCRIP_JOURNEY_URL,
  type VidscripPlaylistItem,
} from "@/app/lib/rezum-vidscrip-playlists";

type VidscripPlaylistCarouselProps = {
  videos: readonly VidscripPlaylistItem[];
  /** Short name for the live region, e.g. "Quick 5-part overview" */
  label: string;
  className?: string;
};

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function VidscripPlaylistCarousel({ videos, label, className }: VidscripPlaylistCarouselProps) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const n = videos.length;
  const current = videos[index] ?? videos[0];

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? n - 1 : i - 1));
  }, [n]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= n - 1 ? 0 : i + 1));
  }, [n]);

  useEffect(() => {
    const video = videoRef.current;
    const item = videos[index];
    if (!video || !item) return;

    let hls: Hls | null = null;
    video.poster = item.poster;

    const cleanup = () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.removeAttribute("src");
      video.load();
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = item.src;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(item.src);
      hls.attachMedia(video);
    } else {
      video.src = item.src;
    }

    return cleanup;
  }, [index, videos]);

  if (n === 0) return null;

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md ring-1 ring-slate-200">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          controls
          playsInline
          preload="metadata"
          aria-label={`${label}: ${current.title}`}
        />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-start">
          <button
            type="button"
            className={BTN_ICON_SECONDARY}
            onClick={goPrev}
            aria-label="Previous video"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className={BTN_ICON_SECONDARY}
            onClick={goNext}
            aria-label="Next video"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-sm font-semibold leading-snug text-slate-900">{current.title}</p>
          <p className="mt-1 text-xs font-medium text-slate-500" aria-live="polite">
            Video {index + 1} of {n}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-600 sm:text-left">
        Full playlist on{" "}
        <Link
          href={REZUM_VIDSCRIP_JOURNEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 underline-offset-2 hover:underline"
        >
          Vidscrip
        </Link>
        .
      </p>
    </div>
  );
}
