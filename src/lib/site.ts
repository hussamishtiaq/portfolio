/**
 * Single source of truth for personal details.
 * Everything marked TODO is a placeholder; replace it before deploying.
 */
export const site = {
  name: "Hussam Ishtiaq Qureshi",
  shortName: "Hussam Ishtiaq Qureshi ",
  initials: "HQ",
  role: "Senior Full-Stack Engineer",
  // TODO: your production domain (used for canonical URLs, sitemap, OG images)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hussamqureshi.dev",
  description:
    "Hussam Ishtiaq Qureshi is a senior full-stack engineer who designs and ships offline-first apps, realtime systems and the APIs behind them, end to end.",
  location: "Pakistan · Remote worldwide",
  timezone: "Asia/Karachi",
  availability: "Open to senior, lead & contract roles",
  // TODO: replace with your real contact details
  email: "hussamishtiaq0@gmail.com",
  calendar: "", // e.g. https://cal.com/your-handle; leave empty to fall back to email
  resume: "", // e.g. /resume.pdf placed in /public
  socials: {
    github: "https://github.com/hussamishtiaq", // TODO
    linkedin: "https://www.linkedin.com/in/", // TODO
  },
  languages: ["TypeScript", "JavaScript", "Python", "C#", "Go", "SQL"],
} as const;

export const contactHref = site.calendar || `mailto:${site.email}`;
