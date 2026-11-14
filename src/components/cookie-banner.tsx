"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  onOpenCookieSettings,
  openCookieSettings,
  saveConsent,
  useConsent,
} from "@/lib/consent";

/**
 * Consent banner. "Accept all" and "Reject all" sit side by side with equal
 * weight — EU regulators treat a hidden or harder-to-reach reject option as
 * invalid consent. Nothing optional loads until the visitor opts in.
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [external, setExternal] = useState(false);

  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setReopened(true);
        setShowDetails(true);
      }),
    [],
  );

  useEffect(() => {
    if (consent) setExternal(consent.external);
  }, [consent]);

  // Unknown during hydration; hidden once a choice exists, unless reopened.
  if (consent === undefined || (consent && !reopened)) return null;

  function choose(choice: { external: boolean }) {
    saveConsent(choice);
    setReopened(false);
    setShowDetails(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-rule bg-white p-6 shadow-2xl">
        <h2 id="cookie-banner-title" className="text-lg">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t("body")}{" "}
          <Link
            href="/polityka-prywatnosci#cookies"
            className="text-burgundy underline underline-offset-4"
          >
            {t("policyLink")}
          </Link>
        </p>

        {showDetails && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-rule p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-ink">{t("necessaryTitle")}</p>
                <span className="shrink-0 text-xs text-muted">{t("alwaysOn")}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {t("necessaryBody")}
              </p>
            </div>

            <label className="block cursor-pointer rounded-xl border border-rule p-4">
              <span className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-ink">{t("externalTitle")}</span>
                <input
                  type="checkbox"
                  checked={external}
                  onChange={(event) => setExternal(event.target.checked)}
                  className="size-4 shrink-0 accent-[#6b1f2e]"
                />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                {t("externalBody")}
              </span>
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => choose({ external: false })}
            className="rounded-lg border border-burgundy px-5 py-2.5 text-sm font-medium text-burgundy hover:bg-beige-pale"
          >
            {t("rejectAll")}
          </button>
          <button
            type="button"
            onClick={() => choose({ external: true })}
            className="rounded-lg border border-burgundy bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-burgundy-deep"
          >
            {t("acceptAll")}
          </button>
          {showDetails ? (
            <button
              type="button"
              onClick={() => choose({ external })}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-ink underline underline-offset-4 hover:text-burgundy sm:ml-auto"
            >
              {t("save")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-ink underline underline-offset-4 hover:text-burgundy sm:ml-auto"
            >
              {t("customize")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so a choice can be changed or withdrawn. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="underline-offset-4 hover:underline"
    >
      {label}
    </button>
  );
}
