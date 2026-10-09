import { useTranslations } from "next-intl";

/**
 * Text-built version of the MCH lockup: burgundy tile with gold corner
 * brackets, then a two-line wordmark split by a gold rule. The wordmark is
 * live text so it follows the page language (see nav.logoLine1/2).
 */
export function Logo() {
  const t = useTranslations("nav");
  const bracket = "absolute size-[22%] border-gold";

  return (
    <span className="flex items-center gap-3 sm:gap-4">
      <span
        aria-hidden="true"
        className="relative flex size-12 shrink-0 items-center justify-center bg-burgundy sm:size-14"
      >
        <span className={`${bracket} left-[12%] top-[12%] border-l-2 border-t-2`} />
        <span className={`${bracket} right-[12%] top-[12%] border-r-2 border-t-2`} />
        <span className={`${bracket} bottom-[12%] left-[12%] border-b-2 border-l-2`} />
        <span className={`${bracket} bottom-[12%] right-[12%] border-b-2 border-r-2`} />
        <span className="font-display text-[0.7rem] leading-none tracking-wide text-beige-pale sm:text-[0.9rem]">
          MCH
        </span>
      </span>
      <span className="flex flex-col font-logo text-[0.7rem] font-normal uppercase leading-none tracking-[0.3em] sm:text-sm">
        <span className="text-burgundy">{t("logoLine1")}</span>
        <span className="my-1.5 h-0.5 bg-gold sm:my-2" aria-hidden="true" />
        <span className="text-ink">{t("logoLine2")}</span>
      </span>
    </span>
  );
}
