import type { PortableTextBlock } from "@portabletext/types";

import {
  treatmentPublicPath,
  type SanityImage,
  type TreatmentBlock,
  type TreatmentPage,
} from "@/app/lib/treatment-pages";

/**
 * Local treatment documents for development and tests.
 * These are not Sanity documents. Do not create, edit, or publish them
 * in the production dataset. The dev server reads them only when
 * TREATMENT_PAGE_FIXTURES=1 and NODE_ENV is not production.
 */

const heroImage: SanityImage = {
  alt: "The Urology Place clinic building",
  hotspot: { x: 0.5, y: 0.4 },
  asset: { _type: "reference", _ref: "image-treatmentherofixture01-1600x900-jpg" },
};

const bodyImage: SanityImage = {
  alt: "Consultation room at the clinic",
  asset: { _type: "reference", _ref: "image-treatmentbodyfixture01-1200x800-jpg" },
};

const shareImage: SanityImage = {
  alt: "The Urology Place",
  sourceName: "clinic-share.jpg",
  asset: { _type: "reference", _ref: "image-treatmentsharefixture01-1200x630-jpg" },
};

const teamImage: SanityImage = {
  alt: "Dr. Naveen Kella",
  asset: { _type: "reference", _ref: "image-treatmentteamfixture01-800x1000-jpg" },
};

function block(
  key: string,
  text: string,
  options?: {
    style?: string;
    href?: string;
    strong?: boolean;
    listItem?: "bullet" | "number";
  },
): PortableTextBlock {
  const markKey = `${key}-link`;
  const marks = [
    ...(options?.strong ? ["strong"] : []),
    ...(options?.href ? [markKey] : []),
  ];
  return {
    _type: "block",
    _key: key,
    style: options?.style ?? "normal",
    ...(options?.listItem ? { listItem: options.listItem, level: 1 } : {}),
    markDefs: options?.href
      ? [{ _key: markKey, _type: "link", href: options.href }]
      : [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks }],
  } as PortableTextBlock;
}

function page(
  values: Pick<TreatmentPage, "_id" | "title" | "slug" | "section"> &
    Partial<TreatmentPage>,
): TreatmentPage {
  return {
    visibility: "unlisted",
    showContactForm: true,
    hero: {
      title: values.title,
      subtitle: "Care at The Urology Place in San Antonio.",
      image: heroImage,
    },
    ...values,
  };
}

const erectileDysfunctionBody: TreatmentBlock[] = [
  {
    _key: "rich",
    _type: "treatmentRichText",
    content: [
      block("rich-h", "How we evaluate erectile dysfunction", { style: "h2" }),
      block(
        "rich-p",
        "Erectile dysfunction is common, and a visit starts with a conversation about your symptoms, health, and goals.",
      ),
      block("rich-strong", "Treatment is matched to you.", { strong: true }),
      block("rich-bullet", "A review of your symptoms and medical history", {
        listItem: "bullet",
      }),
      block("rich-link", "See men's sexual health", {
        href: "/men/male-sexual-dysfunction",
      }),
      block("rich-https", "Visit The Urology Place", {
        href: "https://theurologyplace.com/about-us",
      }),
    ],
  },
  {
    _key: "photo",
    _type: "treatmentImage",
    image: bodyImage,
    caption: "In-office consultation",
  },
  {
    _key: "video",
    _type: "treatmentYouTube",
    videoId: "dQw4w9WgXcQ",
    title: "What to expect at the visit",
    caption: "A short overview of the visit.",
  },
  {
    _key: "team",
    _type: "treatmentTwoColumn",
    text: [
      block("team-h", "Care from a physician you can talk to", { style: "h2" }),
      block(
        "team-p",
        "Your visit is with the physicians and advanced practice providers at The Urology Place.",
      ),
    ],
    media: "teamMember",
    teamMember: {
      _id: "team-kella-fixture",
      name: "Dr. Naveen Kella",
      role: "Urologist",
      profileImage: teamImage,
    },
  },
  {
    _key: "band-image",
    _type: "treatmentTwoColumn",
    text: [
      block("band-h", "Step one: a proper evaluation", { style: "h2" }),
      block(
        "band-p",
        "The first visit reviews your history and the options that fit your goals.",
      ),
    ],
    media: "image",
    image: bodyImage,
  },
  {
    _key: "table",
    _type: "treatmentComparisonTable",
    caption: "Two ways to start the conversation",
    columns: [
      { _key: "c1", heading: "" },
      { _key: "c2", heading: "Clinic visit" },
      { _key: "c3", heading: "Follow-up" },
    ],
    rows: [
      {
        _key: "r1",
        cells: [
          { _key: "a", text: "Where" },
          { _key: "b", text: "In the office" },
          { _key: "c", text: "In the office or by message" },
        ],
      },
      {
        _key: "r2",
        cells: [
          { _key: "d", text: "Focus" },
          { _key: "e", text: "History and goals" },
          { _key: "f", text: "How the plan is working" },
        ],
      },
    ],
  },
  {
    _key: "faq",
    _type: "treatmentFaq",
    items: [
      {
        _key: "q1",
        question: "What should I ask at the first visit?",
        answer: [
          block("faq-p", "Bring a list of medicines and the questions you want answered."),
          block("faq-strong", "Ask the clinic", { strong: true }),
          block("faq-bullet", "How long the visit usually takes", { listItem: "bullet" }),
          block("faq-number", "Call the clinic if your symptoms change", {
            listItem: "number",
          }),
          block("faq-path", "Read about men's sexual health", {
            href: "/men/male-sexual-dysfunction",
          }),
          block("faq-https", "About the clinic", {
            href: "https://theurologyplace.com/about-us",
          }),
        ],
      },
    ],
  },
  {
    _key: "button",
    _type: "treatmentCallToAction",
    label: "Contact the clinic",
    href: "/patient-resources/contact-us",
  },
  {
    _key: "related-path",
    _type: "treatmentRelated",
    linkKind: "path",
    manualPath: "/men/male-sexual-dysfunction",
  },
  {
    _key: "related-treatment",
    _type: "treatmentRelated",
    linkKind: "treatment",
    treatment: {
      _id: "treatment-bulkamid-preview",
      title: "Bulkamid CMS preview",
      section: "women",
      parentPath: "",
      slug: "bulkamid-cms-preview",
    },
  },
];

export const TREATMENT_PAGE_FIXTURES: TreatmentPage[] = [
  page({
    _id: "fixture-erectile-dysfunction",
    title: "Erectile Dysfunction",
    slug: "erectile-dysfunction",
    section: "men",
    cardDescription: "Evaluation and treatment options for erectile dysfunction.",
    seoTitle: "Erectile Dysfunction Treatment in San Antonio",
    seoDescription:
      "Evaluation and treatment for erectile dysfunction at The Urology Place in San Antonio.",
    shareImage,
    showContactForm: true,
    defaultAppointmentReason: "Erectile Dysfunction Treatment",
    previousPaths: ["/men/ed-previous-address"],
    hero: {
      title: "Erectile Dysfunction",
      subtitle: "Talk with a urologist about symptoms, causes, and treatment options.",
      image: heroImage,
    },
    body: erectileDysfunctionBody,
  }),
  page({
    _id: "fixture-bulkamid-preview",
    title: "Bulkamid CMS preview",
    slug: "bulkamid-cms-preview",
    section: "women",
    showContactForm: true,
    defaultAppointmentReason: "Urinary Incontinence",
    seoDescription: "A local preview of a treatment page. This is not the live Bulkamid page.",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [
          block(
            "preview-p",
            "This preview uses the shared treatment template. The live Bulkamid page stays on its own file.",
          ),
        ],
      },
    ],
  }),
  page({
    _id: "fixture-ed-under-hub",
    title: "Erectile dysfunction options",
    slug: "erectile-dysfunction-options",
    section: "men",
    parentPath: "male-sexual-dysfunction",
    defaultAppointmentReason: "Erectile Dysfunction Treatment",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [block("hub-p", "This page sits under the men's sexual health hub.")],
      },
    ],
  }),
  page({
    _id: "fixture-form-hidden",
    title: "Form hidden preview",
    slug: "form-hidden-preview",
    section: "women",
    showContactForm: false,
    defaultAppointmentReason: "Urinary Incontinence",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [block("hidden-p", "This preview does not embed the patient form.")],
      },
    ],
  }),
  page({
    _id: "fixture-invalid-reason",
    title: "Erectile Dysfunction",
    slug: "invalid-reason-preview",
    section: "men",
    defaultAppointmentReason: "Made Up Reason",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [block("invalid-p", "An unknown stored reason is ignored.")],
      },
    ],
  }),
  page({
    _id: "fixture-title-mapped",
    title: "Vasectomy",
    slug: "title-mapped-reason",
    section: "men",
    defaultAppointmentReason: "",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [block("mapped-p", "An empty reason uses the page title.")],
      },
    ],
  }),
  page({
    _id: "fixture-general-fallback",
    title: "Evening Clinic Notes",
    slug: "general-reason-fallback",
    section: "men",
    body: [
      {
        _key: "intro",
        _type: "treatmentRichText",
        content: [block("fallback-p", "A title with no match uses General Urology.")],
      },
    ],
  }),
];

export function matchTreatmentFixtures(section: string, path: string): TreatmentPage[] {
  return TREATMENT_PAGE_FIXTURES.filter((item) => {
    if (item.section !== section) return false;
    if (treatmentPublicPath(item) === path) return true;
    return (item.previousPaths ?? []).includes(path);
  });
}

export function treatmentFixtureByPath(path: string): TreatmentPage | undefined {
  return TREATMENT_PAGE_FIXTURES.find((item) => treatmentPublicPath(item) === path);
}
