import { readdir, stat } from "fs/promises";
import path from "path";

/** `public/images/medical-educational-purpose/` — hyphenated so photo URLs have no spaces. */
export const CIRCUMCISION_PHOTOS_PUBLIC_ROOT = "medical-educational-purpose";

const PATIENT_DIR = /^patient-([a-z])$/i;

const IMAGE_EXT = /\.(jpe?g|png|gif|webp)$/i;

export type CircumcisionPatientGallery = {
  letter: string;
  label: string;
  /** Optional clinical context shown under the patient heading (above images). */
  description?: string;
  /** Public URL paths for `next/image` (`/images/...`, no spaces). */
  imageSrcs: string[];
};

/** Copy for specific cases; keys are uppercase letters. */
const PATIENT_CASE_NOTES: Partial<Record<string, string>> = {
  Q: "He wanted to remain uncircumcised. tore his frenulum and needed a repair. 20--30 y/o",
  R: "This patient had a previous penile implant for erectile dysfunction and elected to pursue a circumcision later for personal reasons. After evaluating, we were able to do this safely in our office",
  S: "22 y/o who received a circumcision revision from Dr. Naveen Kella. He was unhappy with the appearance of his initial circumcision he received at the age of 6.",
};

/** Build `/images/medical-educational-purpose/patient-a/001.jpg`. */
function circumcisionPhotoSrc(patientLetter: string, filename: string): string {
  const letter = patientLetter.toLowerCase();
  return `/images/${CIRCUMCISION_PHOTOS_PUBLIC_ROOT}/patient-${letter}/${encodeURIComponent(filename)}`;
}

/**
 * Reads `public/images/medical-educational-purpose/patient-a` … `patient-z`
 * (single-letter folders only), returns galleries with sorted image filenames.
 * Skips folders with no image files. Works at build time and on the Node server.
 */
export async function loadCircumcisionPatientGalleries(): Promise<
  CircumcisionPatientGallery[]
> {
  const absRoot = path.join(
    process.cwd(),
    "public",
    "images",
    CIRCUMCISION_PHOTOS_PUBLIC_ROOT,
  );

  let names: string[];
  try {
    names = await readdir(absRoot);
  } catch {
    return [];
  }

  const galleries: CircumcisionPatientGallery[] = [];

  for (const name of names) {
    const match = name.match(PATIENT_DIR);
    if (!match) continue;

    const dirPath = path.join(absRoot, name);
    try {
      const st = await stat(dirPath);
      if (!st.isDirectory()) continue;
    } catch {
      continue;
    }

    const letterLower = match[1].toLowerCase();
    const letterUpper = letterLower.toUpperCase();

    let files: string[];
    try {
      files = await readdir(dirPath);
    } catch {
      continue;
    }

    const images = files
      .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (images.length === 0) continue;

    const note = PATIENT_CASE_NOTES[letterUpper];

    galleries.push({
      letter: letterUpper,
      label: `Patient ${letterUpper}`,
      ...(note != null && note.length > 0 ? { description: note } : {}),
      imageSrcs: images.map((f) => circumcisionPhotoSrc(letterUpper, f)),
    });
  }

  galleries.sort((a, b) => a.letter.localeCompare(b.letter));

  return galleries;
}
