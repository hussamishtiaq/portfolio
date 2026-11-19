/**
 * Work history. The section renders automatically once this list has entries.
 * Newest first. Example:
 * { period: "2024 — Now", company: "Acme", role: "Senior Full-Stack Engineer", summary: "Led ...", href: "https://acme.com" }
 */
export type Experience = { period: string; company: string; role: string; summary: string; href?: string };

export const experience: Experience[] = [];
