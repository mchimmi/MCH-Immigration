"use client";

import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { saveConsent, useConsent } from "@/lib/consent";

/**
 * Google's appointment widget sets Google cookies inside the iframe, so it
 * only loads once the visitor has allowed embedded content. Until then a
 * placeholder explains why, offers a one-click opt-in, and links to the same
 * schedule on Google's own site as a way to book without the embed.
 */
export function BookingEmbed() {
  const t = useTranslations("schedulePage");
  const consent = useConsent();

  if (consent?.external) {
    return (
      <div className="mt-10 overflow-hidden rounded-2xl border border-rule">
        <iframe
          src={site.booking.embedUrl}
          title={t("iframeTitle")}
          // Tall enough to show a full day of slots without the iframe
          // scrolling internally (Google's page stacks on narrow screens).
          className="block h-[1750px] w-full md:h-[1250px]"
          style={{ border: 0 }}
        />
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-rule bg-beige-pale p-8 sm:p-10">
      {/* Kept empty while consent is still being read, so the notice does
          not flash for visitors who already allowed the embed. */}
      {consent !== undefined && (
        <>
          <h2 className="text-xl">{t("consent.title")}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            {t("consent.body")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => saveConsent({ external: true })}
              className="rounded-lg bg-burgundy px-6 py-3 text-white hover:bg-burgundy-deep"
            >
              {t("consent.allow")}
            </button>
            <a
              href={site.booking.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3 text-burgundy underline underline-offset-4"
            >
              {t("consent.openExternal")}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
