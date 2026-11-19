import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = `${site.name}, ${site.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: `${site.role} · ${site.availability}`,
    title: "I engineer software that holds up in the real world.",
    subtitle:
      "Multi-tenant SaaS, realtime platforms and offline-first apps, from the Postgres schema to the one-click installer.",
  });
}
