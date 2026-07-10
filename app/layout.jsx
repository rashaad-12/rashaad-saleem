import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { fontVariables } from "@/lib/fonts";
import { Providers } from "@/components/layout/Providers";
import { profile } from "@/content/profile";

const SITE_URL = "https://rashaadsaleem.com";
const TITLE = `${profile.name} · Software Engineer`;
const DESCRIPTION =
  "Software engineer, three years on an enterprise logistics platform. Java and Spring services, React screens, and the refactors in between. Bangalore, ready to relocate. Open to SDE II roles.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${profile.name}` },
  description: DESCRIPTION,
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: profile.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
  },
};

export const viewport = {
  themeColor: "#1d1a17",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <Providers>
          <a
            href="#top"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-ink focus:px-4 focus:py-2 focus:text-ground"
          >
            Skip to content
          </a>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
