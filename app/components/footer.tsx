import Link from "next/link";
import { ClinicMapEmbed } from "@/app/components/clinic-map-embed";
import { BTN_ICON_PRIMARY } from "@/app/lib/button-styles";
import {
  CLINIC_BUSINESS_HOURS_ROWS,
  CLINIC_PHONE,
  clinicPhoneTelHref,
} from "@/app/lib/clinic-info";
const EMAIL = "messages@theupi.com";
const ADDRESS = "9618 Huebner Road, Suite 120 San Antonio, TX 78240";

const SITE_LINKS = [
  { label: "Contact Us", href: "/patient-resources/contact-us" },
  { label: "Patient Portal", href: "/patient-resources/patient-portal" },
] as const;

const SOCIAL = [
  { label: "Facebook", href: "https://www.facebook.com/UrologyPlace" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCB2d_EhaltoTvQeVTKibmJQ" },
  { label: "X", href: "https://x.com/theurologyplace" },
  { label: "Instagram", href: "https://www.instagram.com/theurologyplace/" },
  { label: "TikTok", href: "https://www.tiktok.com/@theurology.place?_r=1&_t=ZT-96Ab08kzP93" },
] as const;

export function Footer() {
  return (
    <footer
      className="relative z-30 border-t border-slate-200 bg-slate-100"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {/* Contact + map */}
          <div className="lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <a
                href={clinicPhoneTelHref()}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {CLINIC_PHONE}
              </a>
              <span className="text-slate-400" aria-hidden>|</span>
              <a
                href={`mailto:${EMAIL}`}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                {EMAIL}
              </a>
            </div>
            <p className="mt-1.5 text-sm text-slate-600">{ADDRESS}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Referral Fax: (210) 761-8851 · Office Fax: (888) 316-9464
            </p>
            <ClinicMapEmbed
              height={140}
              frameClassName="mt-3 overflow-hidden rounded-lg ring-1 ring-slate-200"
            />
          </div>

          {/* Site links + hours */}
          <div className="lg:col-span-3 flex flex-col gap-6 sm:flex-row lg:flex-col lg:gap-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Site Links
              </h3>
              <ul className="mt-2 space-y-1.5">
                {SITE_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-700 hover:text-blue-600"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hours
              </h3>
              <dl className="mt-2 space-y-0.5 text-sm text-slate-700">
                {CLINIC_BUSINESS_HOURS_ROWS.map((row) => (
                  <div
                    key={row.days}
                    className="grid grid-cols-[10rem_1fr] gap-x-4"
                  >
                    <dt>{row.days}</dt>
                    <dd>{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Social */}
          <div className="lg:col-span-4">
            <div>
              <p>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Follow Us
                </span>
                <span className="text-sm font-normal normal-case tracking-normal text-slate-700">
                  {" "}
                  - Get fresh, cutting edge health news from us
                </span>
              </p>
              <div className="mt-2 flex gap-2">
                {SOCIAL.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={BTN_ICON_PRIMARY}
                    aria-label={label}
                  >
                    {label === "Facebook" && (
                      <span className="text-sm font-bold">f</span>
                    )}
                    {label === "YouTube" && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )}
                    {label === "X" && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )}
                    {label === "Instagram" && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {label === "TikTok" && (
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M21 8.2c-1.3 0-2.6-.4-3.7-1.1-1-.7-1.8-1.7-2.2-2.9V16c0 3.9-3.1 7-7 7s-7-3.1-7-7 3.1-7 7-7c.4 0 .8 0 1.2.1v3.9c-.4-.2-.8-.3-1.2-.3-1.7 0-3.1 1.4-3.1 3.1S6.6 19.9 8.3 19.9s3.1-1.4 3.1-3.1V1h3.9c.4 1.7 1.4 3.1 2.8 4.1 1 .7 2.2 1.1 3.4 1.1v2z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
