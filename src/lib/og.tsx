import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

/** Shared OG card: dark, dot grid, signal accent. Rendered at build time. */
export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0b0b0e",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
        backgroundSize: "28px 28px",
        color: "#f4f4f6",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a1a1aa" }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#3ddc97" }} />
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{ fontSize: title.length > 40 ? 64 : 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, maxWidth: 1000 }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", maxWidth: 980, lineHeight: 1.35 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#71717a" }}>
        <span>{site.name}</span>
        <span>{site.url.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>,
    ogSize,
  );
}
