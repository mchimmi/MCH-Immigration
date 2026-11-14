import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Source_Serif_4, IBM_Plex_Sans, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieBanner } from "@/components/cookie-banner";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

/**
 * `latin-ext` and `cyrillic` are not optional here. Without them, Polish
 * diacritics (ą ć ę ł ń ó ś ź ż), Spanish accents and Russian Cyrillic text
 * fall back to a different face mid-word and the page looks broken to
 * exactly the audience it is written for.
 */
const serifDisplay = Source_Serif_4({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-serif-display",
});

const sansBody = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans-body",
});

const sansLogo = Montserrat({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400"],
  display: "swap",
  variable: "--font-sans-logo",
});

/**
 * None of the brand faces cover Devanagari (Hindi) or Bengali, so these sit
 * behind them in the font stacks in globals.css. Not preloaded: the browser
 * only fetches them (via unicode-range) on pages that contain those scripts.
 *
 * Self-hosted from src/fonts rather than next/font/google: the Noto families
 * are large, and Turbopack does not retry a failed Google download, so they
 * intermittently broke the Vercel build. Each file is Google's variable-weight
 * subset (400–600) with Google's own unicode-range — see src/fonts/README.md.
 * The ranges are repeated per call because font loader options must be
 * literals.
 */
const devanagariSerif = localFont({
  src: "../../fonts/noto-serif-devanagari.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B0A",
    },
  ],
  variable: "--font-serif-devanagari",
});

const devanagariSans = localFont({
  src: "../../fonts/noto-sans-devanagari.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B0A",
    },
  ],
  variable: "--font-sans-devanagari",
});

const bengaliSerif = localFont({
  src: "../../fonts/noto-serif-bengali.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1",
    },
  ],
  variable: "--font-serif-bengali",
});

const bengaliSans = localFont({
  src: "../../fonts/noto-sans-bengali.woff2",
  weight: "400 600",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1, U+11DF0-11DF1",
    },
  ],
  variable: "--font-sans-bengali",
});

const fontVariables = [
  serifDisplay,
  sansBody,
  sansLogo,
  devanagariSerif,
  devanagariSans,
  bengaliSerif,
  bengaliSans,
]
  .map((font) => font.variable)
  .join(" ");

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    metadataBase: new URL(siteUrl),
    manifest: "/site.webmanifest",
    title: {
      default: `${site.name} — ${t("location")}`,
      template: `%s — ${site.name}`,
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale,
      siteName: site.name,
      title: `${site.name} — ${t("location")}`,
      description: t("description"),
    },
    alternates: { canonical: "/" },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale as Locale);
  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <a
            href="#tresc"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-burgundy focus:px-4 focus:py-2 focus:text-white"
          >
            {t("skipToContent")}
          </a>
          <SiteHeader />
          <main id="tresc" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
