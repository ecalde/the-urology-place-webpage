import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Lets Next compile styled-components the same way for app + transpiled Sanity packages,
    // avoiding duplicate ThemeProvider / useTheme context from split SC bundles.
    styledComponents: true,
  },
  transpilePackages: [
    "sanity",
    "@sanity/ui",
    "next-sanity",
    "@sanity/vision",
  ],
};

export default nextConfig;
