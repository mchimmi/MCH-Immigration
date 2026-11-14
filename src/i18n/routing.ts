import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl", "ru", "hi", "bn", "es"],
  defaultLocale: "en",
  // English has no prefix (mch.pl/kontakt), the others do (mch.pl/pl/kontakt) —
  // same pattern as the mymidwife.pl/en reference site.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
