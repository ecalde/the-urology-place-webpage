/**
 * Phase 1 checks for the treatment page schema.
 * Compiles the Studio schema and runs Sanity's document validator locally.
 * Does not create, publish, or change dataset documents.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { createSchema, validateDocument } from "sanity";

// Sanity's document validator schedules work with window.setTimeout.
if (typeof globalThis.window === "undefined") {
  Object.assign(globalThis, { window: globalThis });
}

import { APPOINTMENT_REASON_OPTIONS } from "../app/lib/contact-form-defaults";
import { schemaTypes } from "../studio/schemaTypes";
import {
  appointmentReasonError,
  comparisonTableError,
  siteLinkError,
  youtubeIdError,
} from "../studio/schemaTypes/treatmentPage/contentRules";
import {
  existingStaticPathError,
  staticTreatmentPathError,
  uniqueTreatmentPathError,
} from "../studio/schemaTypes/treatmentPage/paths";

type Marker = {
  level?: string
  message?: string
  item?: { message?: string }
  path?: Array<string | { _key?: string }>
};

type FetchCall = { query: string; params?: Record<string, unknown> };

const schema = createSchema({
  name: "treatment-page-test",
  types: schemaTypes,
});

let uniquenessCount = 0;
const fetchCalls: FetchCall[] = [];

function client() {
  return {
    fetch: async (query: string, params?: Record<string, unknown>) => {
      fetchCalls.push({ query, params });
      return uniquenessCount;
    },
  };
}

function errorsOf(markers: Marker[]) {
  return markers.filter((marker) => marker.level === "error");
}

function errorText(markers: Marker[]) {
  return errorsOf(markers)
    .map((marker) => marker.message || marker.item?.message || "")
    .join("\n");
}

function pathIncludes(marker: Marker, segment: string) {
  return (marker.path ?? []).some((part) => part === segment);
}

async function validate(document: Record<string, unknown>) {
  fetchCalls.length = 0;
  const markers = (await validateDocument({
    document,
    workspace: {
      schema,
      i18n: {
        loadNamespaces: async () => undefined,
      },
      getClient: client,
    },
    getDocumentExists: async () => true,
    getClient: client,
  } as never)) as Marker[];
  return markers;
}

function text(key: string, value: string, href?: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: href
      ? [{ _key: `${key}-link`, _type: "link", href }]
      : [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text: value,
        marks: href ? [`${key}-link`] : [],
      },
    ],
  };
}

function image(alt: string, ref = "image-test-asset") {
  return {
    _type: "image",
    alt,
    asset: { _type: "reference", _ref: ref },
  };
}

function baseDocument(overrides: Record<string, unknown> = {}) {
  return {
    _id: "drafts.treatment-schema-test",
    _type: "treatmentPage",
    title: "Erectile Dysfunction",
    slug: { _type: "slug", current: "erectile-dysfunction" },
    section: "men",
    parentPath: "male-sexual-dysfunction",
    menuLabel: "ED",
    cardDescription: "Care for erectile dysfunction.",
    sortOrder: 10,
    visibility: "unlisted",
    showContactForm: true,
    defaultAppointmentReason: "Erectile Dysfunction Treatment",
    hero: {
      title: "Erectile Dysfunction",
      subtitle: "Treatment at the clinic",
      image: image("Clinic treatment room", "image-hero"),
    },
    seoTitle: "Erectile dysfunction treatment",
    seoDescription: "A temporary schema test page.",
    body: [
      {
        _key: "rich",
        _type: "treatmentRichText",
        content: [text("rich-copy", "This is the page introduction.")],
      },
    ],
    ...overrides,
  };
}

function fieldOf(typeName: string, fieldName: string) {
  const type = schema.get(typeName) as { fields?: Array<Record<string, unknown>> } | undefined;
  assert.ok(type, `missing schema type ${typeName}`);
  const field = type.fields?.find((item) => item.name === fieldName);
  assert.ok(field, `missing ${typeName}.${fieldName}`);
  return field as {
    name: string
    hidden?: unknown
    readOnly?: unknown
    initialValue?: unknown
    description?: unknown
    type?: {
      name?: string
      hidden?: unknown
      readOnly?: unknown
      initialValue?: unknown
      description?: unknown
      options?: { list?: Array<{ title?: string; value?: string } | string>; layout?: string }
      of?: Array<{ name?: string }>
    }
  };
}

function initialValue(field: ReturnType<typeof fieldOf>) {
  return field.initialValue ?? field.type?.initialValue;
}

function descriptionOf(field: ReturnType<typeof fieldOf>) {
  const value = field.description ?? field.type?.description;
  return typeof value === "string" ? value : "";
}

function optionValues(field: ReturnType<typeof fieldOf>) {
  const list = field.type?.options?.list ?? [];
  return list.map((option) => (typeof option === "string" ? option : option.value));
}

function blockMember(typeName: string, fieldName: string) {
  const type = schema.get(typeName) as {
    fields?: Array<{ name: string; type?: { of?: Array<{ name?: string; fields?: unknown }> } }>
  };
  const field = type.fields?.find((item) => item.name === fieldName);
  const block = field?.type?.of?.find((member) => member.name === "block");
  assert.ok(block, `${typeName}.${fieldName} block`);
  return block as {
    fields?: Array<{
      name: string
      type?: { options?: { list?: Array<{ value?: string }> } }
    }>
  };
}

function optionList(block: ReturnType<typeof blockMember>, fieldName: string) {
  const field = block.fields?.find((item) => item.name === fieldName);
  return (field?.type?.options?.list ?? []).map((item) => item.value);
}

function blockStyles(typeName: string, fieldName: string) {
  return optionList(blockMember(typeName, fieldName), "style");
}

function blockLists(typeName: string, fieldName: string) {
  return optionList(blockMember(typeName, fieldName), "listItem");
}

function faqAnswerBlock() {
  const faq = schema.get("treatmentFaq") as {
    fields?: Array<{
      name: string
      type?: {
        of?: Array<{
          name?: string
          fields?: Array<{
            name: string
            type?: { name?: string; of?: Array<{ name?: string }> }
          }>
        }>
      }
    }>
  };
  const items = faq.fields?.find((field) => field.name === "items");
  const item = items?.type?.of?.find((member) => member.name === "treatmentFaqItem");
  const answer = item?.fields?.find((field) => field.name === "answer");
  assert.equal(answer?.type?.name, "array");
  const members = answer?.type?.of ?? [];
  assert.deepEqual(
    members.map((member) => member.name),
    ["block"],
  );
  return members[0] as {
    fields?: Array<{
      name: string
      type?: {
        options?: { list?: Array<{ value?: string }> }
        of?: Array<{ name?: string; decorators?: Array<{ value?: string }>; annotations?: Array<{ name?: string }> }>
      }
    }>
  };
}

function spanMarks(block: ReturnType<typeof faqAnswerBlock>) {
  const children = block.fields?.find((field) => field.name === "children");
  const span = children?.type?.of?.find((member) => member.name === "span");
  return {
    decorators: (span?.decorators ?? []).map((item) => item.value),
    annotations: (span?.annotations ?? []).map((item) => item.name),
  };
}

function faqAnswer(key: string) {
  return [
    text(`${key}-p`, "Coverage depends on the plan."),
    {
      _type: "block",
      _key: `${key}-bold`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${key}-bold-span`,
          text: "Ask the clinic",
          marks: ["strong"],
        },
      ],
    },
    {
      _type: "block",
      _key: `${key}-list`,
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${key}-list-span`,
          text: "Bring your insurance card",
          marks: [],
        },
      ],
    },
    {
      _type: "block",
      _key: `${key}-steps`,
      style: "normal",
      listItem: "number",
      level: 1,
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${key}-steps-span`,
          text: "Call the clinic",
          marks: [],
        },
      ],
    },
    text(`${key}-link`, "Read the policy", "/patient-resources/insurance"),
    text(`${key}-ext`, "Medicare", "https://www.medicare.gov"),
  ];
}

test("schema compiles and keeps the existing document types", () => {
  const problems = (schema._validation ?? []) as Array<{
    problems?: Array<{ severity?: string; message?: string }>
  }>;
  const schemaErrors = problems.flatMap((group) =>
    (group.problems ?? []).filter((problem) => problem.severity === "error"),
  );
  assert.deepEqual(schemaErrors, []);

  for (const name of [
    "post",
    "author",
    "teamMember",
    "teamCategory",
    "homeAnnouncement",
    "privacyPolicy",
    "treatmentPage",
  ]) {
    assert.equal(schema.get(name)?.type?.name, "document", name);
  }

  for (const name of [
    "treatmentRichText",
    "treatmentImage",
    "treatmentYouTube",
    "treatmentFaq",
    "treatmentComparisonTable",
    "treatmentCallToAction",
    "treatmentRelated",
    "treatmentTwoColumn",
  ]) {
    assert.equal(schema.get(name)?.type?.name, "object", name);
  }

  assert.equal(schema.get("html"), undefined);
  assert.equal(fieldOf("treatmentYouTube", "videoId").type?.name, "string");
  assert.deepEqual(blockStyles("treatmentRichText", "content"), blockStyles("post", "body"));
  assert.deepEqual(blockLists("treatmentRichText", "content"), blockLists("post", "body"));
  assert.deepEqual(blockStyles("treatmentTwoColumn", "text"), blockStyles("post", "body"));

  const answer = faqAnswerBlock();
  assert.deepEqual(optionList(answer, "style"), ["normal"]);
  assert.deepEqual(optionList(answer, "listItem"), ["bullet", "number"]);
  assert.deepEqual(spanMarks(answer), {
    decorators: ["strong"],
    annotations: ["link"],
  });
});

test("contact form fields use the shared appointment reason list", () => {
  const reason = fieldOf("treatmentPage", "defaultAppointmentReason");
  const form = fieldOf("treatmentPage", "showContactForm");
  const visibility = fieldOf("treatmentPage", "visibility");
  const previous = fieldOf("treatmentPage", "previousPaths");
  const values = optionValues(reason);

  assert.deepEqual(values, [...APPOINTMENT_REASON_OPTIONS]);
  assert.ok(values.includes("Erectile Dysfunction Treatment"));
  assert.ok(values.includes("Other"));
  assert.equal(values.includes("Custom" as (typeof values)[number]), false);
  assert.equal(reason.type?.options?.layout, "dropdown");
  assert.match(descriptionOf(reason), /website section/i);
  assert.match(descriptionOf(reason), /appointment reason/i);
  assert.match(descriptionOf(reason), /Erectile Dysfunction Treatment/);
  assert.equal(initialValue(form), true);
  assert.match(
    descriptionOf(form),
    /Turn it off only when this page should not embed the patient form/,
  );
  assert.equal(initialValue(visibility), "unlisted");
  assert.equal(previous.hidden ?? previous.type?.hidden, true);
  assert.equal(previous.readOnly ?? previous.type?.readOnly, true);
  assert.deepEqual(optionValues(fieldOf("treatmentPage", "section")), ["men", "women"]);
});

test("path rules reject static pages and ignore dynamic inventory rows", () => {
  assert.match(
    String(staticTreatmentPathError("/men/vasectomy")),
    /\/men\/vasectomy/,
  );
  assert.match(
    String(staticTreatmentPathError("/women/bulkamid-for-stress-incontinence")),
    /\/women\/bulkamid-for-stress-incontinence/,
  );
  assert.equal(staticTreatmentPathError("/men/erectile-dysfunction"), true);
  assert.equal(
    staticTreatmentPathError("/men/male-sexual-dysfunction/erectile-dysfunction"),
    true,
  );
  assert.equal(staticTreatmentPathError("/patient-resources/blog/[slug]"), true);
  assert.equal(
    existingStaticPathError("/women/bulkamid-for-stress-incontinence"),
    true,
  );
  assert.notEqual(existingStaticPathError("/patient-resources/blog/[slug]"), true);
  assert.notEqual(existingStaticPathError("/men/not-a-real-page"), true);
  assert.equal(siteLinkError("/men/vasectomy"), true);
  assert.equal(siteLinkError("https://example.com/info"), true);
  assert.notEqual(siteLinkError("http://example.com"), true);
  assert.notEqual(siteLinkError("javascript:alert(1)"), true);
  assert.notEqual(siteLinkError("//example.com"), true);
  assert.equal(youtubeIdError("dQw4w9WgXcQ"), true);
  assert.notEqual(youtubeIdError("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), true);
  assert.equal(appointmentReasonError("", APPOINTMENT_REASON_OPTIONS), true);
  assert.equal(
    appointmentReasonError("Erectile Dysfunction Treatment", APPOINTMENT_REASON_OPTIONS),
    true,
  );
  assert.notEqual(appointmentReasonError("Made up reason", APPOINTMENT_REASON_OPTIONS), true);
  assert.notEqual(comparisonTableError({ columns: [{}], rows: [{ cells: [{}] }] }), true);
});

test("an incomplete treatment cannot be published", async () => {
  const markers = await validate({
    _id: "drafts.incomplete-treatment",
    _type: "treatmentPage",
  });
  const errors = errorsOf(markers);
  assert.ok(errors.length > 0, errorText(markers));
  assert.ok(errors.some((marker) => pathIncludes(marker, "title")), errorText(markers));
  assert.ok(errors.some((marker) => pathIncludes(marker, "slug")), errorText(markers));
  assert.ok(errors.some((marker) => pathIncludes(marker, "section")), errorText(markers));
  assert.ok(errors.some((marker) => pathIncludes(marker, "hero")), errorText(markers));
});

test("a hero without a title or image alt cannot be published", async () => {
  const missingAlt = await validate(
    baseDocument({
      hero: {
        title: "Erectile Dysfunction",
        image: { _type: "image", asset: { _type: "reference", _ref: "image-hero" } },
      },
    }),
  );
  assert.match(errorText(missingAlt), /Describe this image/);

  const missingTitle = await validate(
    baseDocument({
      hero: {
        image: image("Clinic treatment room"),
      },
    }),
  );
  assert.ok(
    errorsOf(missingTitle).some((marker) => pathIncludes(marker, "title")),
    errorText(missingTitle),
  );
});

test("a slug that matches a hardcoded page cannot be published", async () => {
  uniquenessCount = 0;
  const vasectomy = await validate(
    baseDocument({
      title: "Vasectomy",
      slug: { _type: "slug", current: "vasectomy" },
      section: "men",
      parentPath: undefined,
    }),
  );
  assert.match(errorText(vasectomy), /\/men\/vasectomy/);
  assert.equal(fetchCalls.length, 0);

  const bulkamid = await validate(
    baseDocument({
      title: "Bulkamid preview",
      slug: { _type: "slug", current: "bulkamid-for-stress-incontinence" },
      section: "women",
      parentPath: undefined,
    }),
  );
  assert.match(errorText(bulkamid), /\/women\/bulkamid-for-stress-incontinence/);
});

test("a parent from the other section cannot be published", async () => {
  const markers = await validate(
    baseDocument({
      section: "women",
      parentPath: "male-sexual-dysfunction",
      slug: { _type: "slug", current: "new-women-page" },
    }),
  );
  assert.match(errorText(markers), /Women hub/);
});

test("a listed reason is accepted and a custom reason is rejected", async () => {
  uniquenessCount = 0;
  const listed = await validate(baseDocument());
  assert.deepEqual(errorsOf(listed), [], errorText(listed));
  assert.ok(fetchCalls.length > 0);

  const custom = await validate(
    baseDocument({ defaultAppointmentReason: "A reason that is not on the list" }),
  );
  assert.match(errorText(custom), /Choose a reason from the list/);

  const empty = await validate(baseDocument({ defaultAppointmentReason: undefined }));
  assert.deepEqual(errorsOf(empty), [], errorText(empty));
});

test("the same section, parent, and slug cannot be used twice", async () => {
  uniquenessCount = 1;
  const markers = await validate(baseDocument());
  assert.match(errorText(markers), /already exists/);
  const call = fetchCalls.find((item) => item.query.includes('coalesce(parentPath, "")'));
  assert.ok(call, "uniqueness query was not sent");
  assert.equal(call?.params?.section, "men");
  assert.equal(call?.params?.parentPath, "male-sexual-dysfunction");
  assert.equal(call?.params?.slug, "erectile-dysfunction");
  assert.equal(call?.params?.publishedId, "treatment-schema-test");
  assert.equal(call?.params?.draftId, "drafts.treatment-schema-test");
  uniquenessCount = 0;
});

test("a Bulkamid-style document with every block can pass validation", async () => {
  uniquenessCount = 0;
  const markers = await validate(
    baseDocument({
      title: "Bulkamid CMS preview",
      slug: { _type: "slug", current: "bulkamid-cms-preview" },
      section: "women",
      parentPath: undefined,
      visibility: "unlisted",
      showContactForm: true,
      defaultAppointmentReason: "Urinary Incontinence",
      body: [
        {
          _key: "rich",
          _type: "treatmentRichText",
          content: [
            text("intro", "Stress incontinence can be treated in the office."),
            text("link", "Read about Emsella", "/women/emsella-for-incontinence"),
          ],
        },
        {
          _key: "photo",
          _type: "treatmentImage",
          image: image("Illustration of the treatment"),
          caption: "In-office treatment",
        },
        {
          _key: "video",
          _type: "treatmentYouTube",
          videoId: "dQw4w9WgXcQ",
          title: "What to expect",
          caption: "A short overview",
        },
        {
          _key: "faq",
          _type: "treatmentFaq",
          items: [
            {
              _key: "q1",
              _type: "treatmentFaqItem",
              question: "Does insurance cover Bulkamid?",
              answer: faqAnswer("q1"),
            },
          ],
        },
        {
          _key: "table",
          _type: "treatmentComparisonTable",
          caption: "Comparison of Emsella and Bulkamid in-office options",
          columns: [
            { _key: "c1", _type: "treatmentComparisonColumn", heading: "" },
            { _key: "c2", _type: "treatmentComparisonColumn", heading: "Emsella" },
            { _key: "c3", _type: "treatmentComparisonColumn", heading: "Bulkamid" },
          ],
          rows: [
            {
              _key: "r1",
              _type: "treatmentComparisonRow",
              cells: [
                { _key: "a", _type: "treatmentComparisonCell", text: "What it is" },
                { _key: "b", _type: "treatmentComparisonCell", text: "A chair" },
                { _key: "c", _type: "treatmentComparisonCell", text: "A gel" },
              ],
            },
          ],
        },
        {
          _key: "button",
          _type: "treatmentCallToAction",
          label: "Learn more about Emsella",
          href: "/women/emsella-for-incontinence",
        },
        {
          _key: "related",
          _type: "treatmentRelated",
          linkKind: "path",
          manualPath: "/women/emsella-for-incontinence",
        },
        {
          _key: "band",
          _type: "treatmentTwoColumn",
          text: [text("step", "Step One: A proper evaluation")],
          media: "teamMember",
          teamMember: { _type: "reference", _ref: "team-member-test" },
        },
      ],
    }),
  );
  assert.deepEqual(errorsOf(markers), [], errorText(markers));
});

test("FAQ answers accept basic portable text and reject plain text or unsafe links", async () => {
  uniquenessCount = 0;
  const formatted = await validate(
    baseDocument({
      body: [
        {
          _key: "faq",
          _type: "treatmentFaq",
          items: [
            {
              _key: "q1",
              _type: "treatmentFaqItem",
              question: "Does insurance cover this?",
              answer: faqAnswer("ok"),
            },
          ],
        },
      ],
    }),
  );
  assert.deepEqual(errorsOf(formatted), [], errorText(formatted));

  const plain = await validate(
    baseDocument({
      body: [
        {
          _key: "faq",
          _type: "treatmentFaq",
          items: [
            {
              _key: "q1",
              _type: "treatmentFaqItem",
              question: "Does insurance cover this?",
              answer: "Coverage depends on the plan.",
            },
          ],
        },
      ],
    }),
  );
  assert.ok(
    errorsOf(plain).some((marker) => pathIncludes(marker, "answer")),
    errorText(plain),
  );

  const missing = await validate(
    baseDocument({
      body: [
        {
          _key: "faq",
          _type: "treatmentFaq",
          items: [
            {
              _key: "q1",
              _type: "treatmentFaqItem",
              question: "Does insurance cover this?",
              answer: [],
            },
          ],
        },
      ],
    }),
  );
  assert.ok(
    errorsOf(missing).some((marker) => pathIncludes(marker, "answer")),
    errorText(missing),
  );

  const unsafe = await validate(
    baseDocument({
      body: [
        {
          _key: "faq",
          _type: "treatmentFaq",
          items: [
            {
              _key: "q1",
              _type: "treatmentFaqItem",
              question: "Where can I read more?",
              answer: [
                text("http", "Insecure link", "http://example.com"),
                text("script", "Script link", "javascript:alert(1)"),
              ],
            },
          ],
        },
      ],
    }),
  );
  const unsafeErrors = errorsOf(unsafe).filter((marker) => pathIncludes(marker, "answer"));
  assert.ok(unsafeErrors.length >= 2, errorText(unsafe));
  assert.match(errorText(unsafe), /https:\/\//);
});

test("invalid blocks and links cannot be published", async () => {
  uniquenessCount = 0;
  const markers = await validate(
    baseDocument({
      body: [
        {
          _key: "rich",
          _type: "treatmentRichText",
          content: [text("bad-link", "Insecure link", "http://example.com")],
        },
        {
          _key: "video",
          _type: "treatmentYouTube",
          videoId: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Video",
        },
        {
          _key: "photo",
          _type: "treatmentImage",
          image: { _type: "image", asset: { _type: "reference", _ref: "image-no-alt" } },
        },
        {
          _key: "table",
          _type: "treatmentComparisonTable",
          columns: [
            { _key: "c1", _type: "treatmentComparisonColumn", heading: "A" },
            { _key: "c2", _type: "treatmentComparisonColumn", heading: "B" },
          ],
          rows: [
            {
              _key: "r1",
              _type: "treatmentComparisonRow",
              cells: [{ _key: "a", _type: "treatmentComparisonCell", text: "Only one" }],
            },
          ],
        },
        {
          _key: "related",
          _type: "treatmentRelated",
          linkKind: "path",
          manualPath: "/patient-resources/blog/[slug]",
        },
        {
          _key: "button",
          _type: "treatmentCallToAction",
          label: "Outside",
          href: "javascript:alert(1)",
        },
      ],
    }),
  );
  const textErrors = errorText(markers);
  const linkErrors = errorsOf(markers).filter((marker) =>
    (marker.message || "").includes("starts with https://"),
  );
  assert.match(textErrors, /https:\/\//);
  assert.ok(linkErrors.length >= 2, textErrors);
  assert.match(textErrors, /YouTube video id/);
  assert.match(textErrors, /Describe this image/);
  assert.match(textErrors, /needs 2 cells/);
  assert.match(textErrors, /already on the website/);
});

test("uniqueness helper excludes the current draft and published ids", async () => {
  const seen: FetchCall[] = [];
  const result = await uniqueTreatmentPathError(
    {
      fetch: async (query, params) => {
        seen.push({ query, params });
        return 0;
      },
    },
    {
      _id: "drafts.abc",
      section: "men",
      parentPath: "",
      slug: { current: "erectile-dysfunction" },
    },
  );
  assert.equal(result, true);
  assert.equal(seen[0]?.params?.publishedId, "abc");
  assert.equal(seen[0]?.params?.draftId, "drafts.abc");
  assert.equal(seen[0]?.params?.parentPath, "");
});
