"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  children?: {
    label: string;
    href: string;
    children?: {
      label: string;
      href: string;
    }[];
  }[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Men",
    href: "/men",
    children: [
      { label: "Men's Wellness", href: "/men/mens-wellness" },
      { label: "Hematuria", href: "/men/hematuria" },
      {
        label: "Prostate Cancer",
        href: "/men/prostate-cancer",
        children: [
          { label: "Robotic Prostatectomy", href: "/men/prostate-cancer/robotic-prostatectomy" },
          { label: "Prostate Biopsy", href: "/men/prostate-cancer/prostate-biopsy" },
          { label: "TULSA for Prostate", href: "/men/prostate-cancer#tulsa" },
          { label: "Nuclear Medicine", href: "/men/prostate-cancer#nuclear-medicine" },
        ],
      },
      { label: "Adult Circumcision", href: "/men/adult-circumcision" },
      {
        label: "Enlarged Prostate",
        href: "/men/enlarged-prostate",
        children: [
          { label: "iTind for Enlarged Prostate (BPH)", href: "/men/enlarged-prostate#itind" },
          { label: "Rezūm", href: "/men/enlarged-prostate#rezum" },
          { label: "Enlarged Prostate Laser Treatment", href: "/men/enlarged-prostate#laser-treatment" },
          { label: "UroLift", href: "/men/enlarged-prostate#urolift" },
        ],
      },
      { label: "Bladder Cancer", href: "/men/bladder-cancer" },
      {
        label: "Male Sexual Dysfunction",
        href: "/men/male-sexual-dysfunction",
        children: [
          { label: "Peyronie's Disease", href: "/men/male-sexual-dysfunction#peyronies" },
          { label: "GAINSWave", href: "/men/male-sexual-dysfunction#gainswave" },
        ],
      },
      { label: "Vasectomy", href: "/men/vasectomy" },
      { label: "Low Testosterone", href: "/men/low-testosterone" },
      { label: "Urinary Incontinence", href: "/men/urinary-incontinence" },
      { label: "Kidney Stones", href: "/men/kidney-stones" },
    ],
  },
  {
    label: "Women",
    href: "/women",
    children: [
      { label: "Hematuria", href: "/women/hematuria" },
      { label: "Emsella for Incontinence", href: "/women/emsella-for-incontinence" },
      {
        label: "Hormone Replacement Therapy",
        href: "/women/hormone-replacement-therapy",
      },
      { label: "Kidney Stones", href: "/women/kidney-stones" },
    ],
  },
  {
    label: "Clinical Research",
    href: "/clinical-research",
    children: [
      {
        label: "Prostate Cancer Studies",
        href: "/clinical-research/prostate-cancer-studies",
      },
      { label: "Overactive Bladder", href: "/clinical-research/overactive-bladder" },
      { label: "BPH Studies", href: "/clinical-research/bph-studies" },
    ],
  },
  {
    label: "Weight Loss",
    href: "/weight-loss",
    children: [
      {
        label: "Counseling and Injections",
        href: "/weight-loss/counseling-and-injections",
      },
    ],
  },
  {
    label: "Patient Resources",
    href: "/patient-resources",
    children: [
      { label: "Contact Us", href: "/patient-resources/contact-us" },
      { label: "Physician Referral", href: "/patient-resources/physician-referral" },
      { label: "New Patient Forms", href: "/patient-resources/new-patient-forms" },
      { label: "Patient Portal", href: "/patient-resources/patient-portal" },
      { label: "Insurance", href: "/patient-resources/insurance" },
      { label: "Out of Town Patients", href: "/patient-resources/out-of-town-patients" },
      { label: "Blog", href: "/patient-resources/blog" },
      { label: "Order Supplements", href: "/patient-resources/order-supplements" },
    ],
  },
  { label: "Join Our Team", href: "/join-our-team" },
  { label: "In-Office Anesthesia", href: "/in-office-anesthesia" },
];

const CONTACT_HREF = "/patient-resources/contact-us";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const [expandedMobileSubsection, setExpandedMobileSubsection] = useState<string | null>(null);
  const [activeDesktopFlyout, setActiveDesktopFlyout] = useState<{
    parentLabel: string;
    childLabel: string;
    topPx: number;
  } | null>(null);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const toggleMobileSection = (label: string) => {
    setExpandedMobileSection((current) => (current === label ? null : label));
    setExpandedMobileSubsection(null);
  };

  const toggleMobileSubsection = (key: string) => {
    setExpandedMobileSubsection((current) => (current === key ? null : key));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-6">
        {/* Mobile Controls + Logo / Brand (mobile-first left alignment) */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={toggleMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-4 rounded bg-slate-700" />
              <span className="block h-0.5 w-4 rounded bg-slate-700" />
              <span className="block h-0.5 w-4 rounded bg-slate-700" />
            </div>
          </button>

          {/* Logo / Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/images/branding/TheUrologyPlaceLogo.png"
              alt="The Urology Place"
              width={640}
              height={338}
              priority
              sizes="(min-width: 1024px) 140px, (min-width: 640px) 200px, 180px"
              className="h-8 w-auto max-w-[200px] object-contain sm:h-10 lg:max-w-[140px]"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden h-10 flex-nowrap items-center gap-3 text-sm font-medium text-slate-700 lg:ml-6 lg:mr-6 lg:flex xl:gap-4">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="group relative flex h-10 items-center after:absolute after:left-0 after:right-0 after:top-full after:h-2 after:content-['']"
                onMouseLeave={() => setActiveDesktopFlyout(null)}
              >
                <button
                  className={`flex h-10 items-center gap-1 whitespace-nowrap border-b-2 pb-0 pt-0.5 transition ${
                    isActive(item.href)
                      ? "border-blue-600 text-slate-900"
                      : "border-transparent text-slate-700 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-slate-500">▾</span>
                </button>
                <div
                  className="invisible absolute left-0 top-full mt-0 rounded-xl border border-slate-200 bg-white pt-2 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100"
                >
                  <div className="relative flex">
                    {/* Left panel */}
                    <div className="w-72 py-2">
                      {item.children.map((child) => {
                        const hasFlyout = Boolean(child.children?.length);
                        const isFlyoutActive =
                          activeDesktopFlyout?.parentLabel === item.label &&
                          activeDesktopFlyout?.childLabel === child.label;

                        return (
                          <div
                            key={child.href}
                            onMouseEnter={(e) => {
                              if (hasFlyout) {
                                setActiveDesktopFlyout({
                                  parentLabel: item.label,
                                  childLabel: child.label,
                                  topPx: (e.currentTarget as HTMLDivElement).offsetTop,
                                });
                              } else {
                                setActiveDesktopFlyout(null);
                              }
                            }}
                            className={`flex items-center justify-between gap-3 px-4 py-2 text-sm transition ${
                              isFlyoutActive
                                ? "bg-slate-50 text-slate-900"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                          >
                            <Link href={child.href} className="min-w-0 flex-1">
                              {child.label}
                            </Link>
                            {hasFlyout ? (
                              <span className="text-slate-400" aria-hidden>
                                ▸
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right flyout panel (slides in) */}
                    {(() => {
                      const activeChild =
                        activeDesktopFlyout?.parentLabel === item.label
                          ? item.children.find((c) => c.label === activeDesktopFlyout.childLabel)
                          : undefined;
                      const flyoutItems = activeChild?.children ?? [];
                      const showFlyout = flyoutItems.length > 0;

                      return (
                        <div
                          className={`absolute left-[18rem] w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-lg transition-all duration-200 ease-out ${
                            showFlyout
                              ? "pointer-events-auto translate-x-0 opacity-100"
                              : "pointer-events-none translate-x-4 opacity-0"
                          }`}
                          style={{ top: activeDesktopFlyout?.topPx ?? 0 }}
                        >
                          {flyoutItems.map((grand) => (
                            <Link
                              key={grand.href}
                              href={grand.href}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            >
                              {grand.label}
                            </Link>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`flex h-10 items-center whitespace-nowrap border-b-2 pb-0 pt-0.5 text-sm transition ${
                  isActive(item.href)
                    ? "border-blue-600 text-slate-900"
                    : "border-transparent text-slate-700 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Desktop Contact Button */}
        <div className="hidden lg:block">
          <Link
            href={CONTACT_HREF}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Contact (top-right) */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href={CONTACT_HREF}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>

    {/* Mobile menu: outside header so it isn't clipped; fixed to viewport, above all content */}
    <div
      className={`fixed inset-0 z-[9999] lg:hidden ${
        mobileOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!mobileOpen}
    >
      {/* Full-screen backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 transition-opacity ${
          mobileOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={toggleMobile}
        aria-hidden="true"
      />

      {/* Panel: fixed to viewport, left-anchored */}
      <aside
        className={`fixed left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-[transform] duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        aria-label="Main navigation"
      >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/branding/TheUrologyPlaceLogo.png"
                alt="The Urology Place"
                width={150}
                height={32}
                className="h-7 w-auto"
              />
            </div>
            <button
              type="button"
              onClick={toggleMobile}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="Close navigation menu"
            >
              <span className="sr-only">Close menu</span>
              <span className="text-lg">&times;</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4 text-sm">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="border-b border-slate-100 pb-2 last:border-b-0">
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleMobileSection(item.label)}
                        className={`flex w-full items-center justify-between gap-2 py-2 text-left text-sm font-medium ${
                          isActive(item.href) ? "text-blue-700" : "text-slate-800"
                        }`}
                        aria-expanded={expandedMobileSection === item.label}
                        aria-controls={`mobile-nav-${item.label.replace(/\s+/g, "-")}`}
                        id={`mobile-nav-trigger-${item.label.replace(/\s+/g, "-")}`}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`ml-1 shrink-0 transition-transform duration-200 ease-out ${
                            expandedMobileSection === item.label ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </span>
                      </button>
                      <ul
                        id={`mobile-nav-${item.label.replace(/\s+/g, "-")}`}
                        className={`space-y-1 overflow-hidden pl-3 text-slate-600 transition-[height] duration-200 ease-out ${
                          expandedMobileSection === item.label ? "visible" : "hidden"
                        }`}
                      >
                        {item.children.map((child) => {
                          const hasSub = Boolean(child.children?.length);
                          const subKey = `${item.label}:${child.label}`;
                          const isSubOpen = expandedMobileSubsection === subKey;

                          if (!hasSub) {
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className={`block py-1.5 text-sm ${
                                    pathname === child.href
                                      ? "text-blue-700 font-medium"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          }

                          return (
                            <li key={child.href}>
                              <button
                                type="button"
                                onClick={() => toggleMobileSubsection(subKey)}
                                className="flex w-full items-center justify-between gap-2 py-1.5 text-left text-sm font-medium text-slate-800 hover:text-slate-900"
                                aria-expanded={isSubOpen}
                              >
                                <span>{child.label}</span>
                                <span className="text-slate-500" aria-hidden>
                                  {isSubOpen ? "−" : "+"}
                                </span>
                              </button>
                              {isSubOpen ? (
                                <ul className="mt-1 space-y-1 pl-4">
                                  {child.children?.map((grand) => (
                                    <li key={grand.href}>
                                      <Link
                                        href={grand.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-1 text-sm text-slate-700 hover:text-slate-900"
                                      >
                                        {grand.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-2 text-sm font-medium ${
                        isActive(item.href) ? "text-blue-700" : "text-slate-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <Link
              href={CONTACT_HREF}
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Contact
            </Link>
          </div>
        </aside>
    </div>
    </>
  );
}

