import { CLINIC_MAP_EMBED_SRC } from "@/app/lib/clinic-map";

type ClinicMapEmbedProps = {
  height: number;
  /** Wrapper classes, used by the footer frame. */
  frameClassName?: string;
};

export function ClinicMapEmbed({ height, frameClassName }: ClinicMapEmbedProps) {
  const iframe = (
    <iframe
      src={CLINIC_MAP_EMBED_SRC}
      width="100%"
      height={height}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="The Urology Place location"
      className="block"
    />
  );

  if (!frameClassName) return iframe;

  return <div className={frameClassName}>{iframe}</div>;
}
