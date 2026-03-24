type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  /**
   * Query string for the embed URL (without leading `?`).
   * Default `rel=0&modestbranding=1` matches prior site embeds. Pass `""` for no extra params.
   */
  embedSearchParams?: string;
};

const DEFAULT_EMBED_PARAMS = "rel=0&modestbranding=1";

export function YouTubeEmbed({
  videoId,
  title,
  className,
  embedSearchParams = DEFAULT_EMBED_PARAMS,
}: YouTubeEmbedProps) {
  const query =
    embedSearchParams && embedSearchParams.length > 0
      ? `?${embedSearchParams}`
      : "";
  return (
    <div
      className={`aspect-video w-full overflow-hidden rounded-lg bg-slate-900 ${className ?? ""}`}
    >
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}${query}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
