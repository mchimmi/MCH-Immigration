import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/content/site";
import { CookieSettingsButton } from "@/components/cookie-banner";

type Props = { params: Promise<{ locale: string }> };

type Section = {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
};

type CookieRow = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    robots: { index: false },
    alternates: { canonical: "/polityka-prywatnosci" },
  };
}

/**
 * TODO — HAVE A LAWYER REVIEW BEFORE LAUNCH.
 *
 * The text follows the GDPR Art. 13 information duties and the ePrivacy
 * cookie rules, but the retention periods, the processor list (email
 * provider, accounting) and the legal form of the controller are the firm's
 * facts to confirm. Keep the cookie table in step with src/lib/consent.ts.
 */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  const sections = t.raw("sections") as Section[];
  const cookieParagraphs = t.raw("cookies.paragraphs") as string[];
  const cookieRows = t.raw("cookies.rows") as CookieRow[];
  const cookieAfter = t.raw("cookies.after") as string[];

  return (
    <div className="mx-auto max-w-3xl px-5 pt-14">
      <h1 className="text-title">{t("title")}</h1>
      <p className="mt-3 text-sm text-muted">{t("updated")}</p>
      <p className="mt-6 leading-relaxed text-muted">{t("intro")}</p>

      <div className="mt-10 space-y-10 leading-relaxed text-ink">
        <section>
          <h2 className="text-xl">{t("administrator.heading")}</h2>
          <p className="mt-3 text-muted">
            {t("administrator.body", {
              entity: site.legal.entity,
              street: site.contact.street,
              postcode: site.contact.postcode,
              city: site.contact.city,
              nip: site.legal.nip,
              regon: site.legal.regon,
              email: site.contact.email,
            })}
          </p>
        </section>

        {sections.map((section) => (
          <PolicySection key={section.id} section={section} />
        ))}

        <section id="cookies">
          <h2 className="text-xl">{t("cookies.heading")}</h2>
          {cookieParagraphs.map((p) => (
            <p key={p} className="mt-3 text-muted">
              {p}
            </p>
          ))}

          <div className="mt-6 overflow-x-auto rounded-xl border border-rule">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-beige-pale text-ink">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("cookies.table.name")}</th>
                  <th className="px-4 py-3 font-medium">{t("cookies.table.provider")}</th>
                  <th className="px-4 py-3 font-medium">{t("cookies.table.purpose")}</th>
                  <th className="px-4 py-3 font-medium">{t("cookies.table.duration")}</th>
                  <th className="px-4 py-3 font-medium">{t("cookies.table.category")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                {cookieRows.map((row) => (
                  <tr key={row.name} className="align-top">
                    <td className="px-4 py-3 font-mono text-xs text-ink">{row.name}</td>
                    <td className="px-4 py-3">{row.provider}</td>
                    <td className="px-4 py-3">{row.purpose}</td>
                    <td className="px-4 py-3">{row.duration}</td>
                    <td className="px-4 py-3">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cookieAfter.map((p) => (
            <p key={p} className="mt-4 text-muted">
              {p}
            </p>
          ))}

          <p className="mt-6">
            <span className="inline-block rounded-lg border border-burgundy px-5 py-2.5 text-sm font-medium text-burgundy hover:bg-beige-pale">
              <CookieSettingsButton label={t("cookies.settingsButton")} />
            </span>
          </p>
        </section>

        <PolicySection
          section={{
            id: "changes",
            heading: t("changes.heading"),
            paragraphs: [t("changes.body")],
          }}
        />
      </div>
    </div>
  );
}

function PolicySection({ section }: { section: Section }) {
  return (
    <section id={section.id}>
      <h2 className="text-xl">{section.heading}</h2>
      {section.paragraphs?.map((p) => (
        <p key={p} className="mt-3 text-muted">
          {p}
        </p>
      ))}
      {section.items && (
        <ul className="mt-4 space-y-2">
          {section.items.map((item) => (
            <li key={item} className="border-l-2 border-beige pl-4 text-muted">
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
