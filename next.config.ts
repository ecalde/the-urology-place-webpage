import type { NextConfig } from "next";
import { THORNE_DISPENSARY_URL } from "./app/lib/external-links";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/patient-resources/privacy-policy-hipaa",
        permanent: false,
      },
      {
        source: "/patient-resources/order-supplements",
        destination: THORNE_DISPENSARY_URL,
        permanent: true,
      },
      {
        source: "/men/prostate-cancer/transperineal-prostate-biopsy",
        destination: "/men/prostate-cancer/psa-transperineal-prostate-biopsy",
        permanent: true,
      },
      {
        source: "/clinical-research/overactive-bladder",
        destination: "/clinical-research/urinary-incontinence-studies",
        permanent: true,
      },
      {
        // Vanity URL for PAE (case-insensitive: /PAE, /pae, etc.)
        source: "/:pae([Pp][Aa][Ee])",
        destination: "/men/enlarged-prostate/prostatic-artery-embolization",
        permanent: true,
      },
    ];
  },
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
