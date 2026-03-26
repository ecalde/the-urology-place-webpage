"use client";

import { useEffect, useState } from "react";
import { NextStudio } from "next-sanity/studio";
import type { Config } from "sanity";

import config from "@/studio/sanity.config";

export default function StudioPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <NextStudio config={config as Config} />;
}
