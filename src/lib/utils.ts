import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  // No tailwind-merge: components avoid conflicting overrides, which keeps ~7 KB out of the client bundle.
  return clsx(inputs);
}

/** Serialize JSON-LD safely for inlining in a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
