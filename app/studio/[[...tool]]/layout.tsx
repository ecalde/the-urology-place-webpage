import type { ReactNode } from "react";
import { metadata, viewport } from "next-sanity/studio";

export { metadata, viewport };

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
