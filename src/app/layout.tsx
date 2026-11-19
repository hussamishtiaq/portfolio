import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PaletteLoader } from "@/components/palette-loader";
import { SpotlightTracker } from "@/components/islands";
import { ServiceWorker } from "@/components/service-worker";
import { themeScript } from "@/components/theme";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const title = `${site.name} | ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.shortName}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    site.name,
    "Hussam Ishtiaq Qureshi",
    "senior full-stack engineer",
    "full-stack developer",
    "NestJS developer",
    "Next.js developer",
    "offline-first",
    "realtime systems",
    "multi-tenant SaaS",
    "Electron developer",
    "C# .NET developer",
    "Python developer",
    "Go developer",
    "hire full-stack developer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    firstName: "Hussam Ishtiaq",
    lastName: "Qureshi",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
  ],
  colorScheme: "dark light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.shortName,
      jobTitle: site.role,
      url: site.url,
      email: `mailto:${site.email}`,
      sameAs: Object.values(site.socials),
      knowsLanguage: "en",
      knowsAbout: [
        "Full-stack development",
        "Distributed systems",
        "Offline-first applications",
        "Realtime systems",
        "Multi-tenant SaaS",
        ...site.languages,
        "NestJS",
        "Next.js",
        "React",
        "Express",
        "ASP.NET Core",
        "PostgreSQL",
        "Electron",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${site.url}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: site.url,
      name: title,
      mainEntity: { "@id": `${site.url}/#person` },
      hasPart: projects.map((p) => ({ "@type": "CreativeWork", name: p.name, url: `${site.url}/work/${p.slug}` })),
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="bg-signal text-signal-fg sr-only z-50 rounded-md px-4 py-2 font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <PaletteLoader />
        <SpotlightTracker />
        <ServiceWorker />
      </body>
    </html>
  );
}
