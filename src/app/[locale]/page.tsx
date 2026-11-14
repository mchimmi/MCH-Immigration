import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/content/site";
import { images } from "@/content/images";
import { CaseFinder } from "@/components/case-finder";
import { GoogleReviewsSection } from "@/components/google-reviews";

/**
 * The full procedure list with descriptions lives at /uslugi (linked from
 * the header's "Usługi" dropdown and "Baza wiedzy"), not here — the
 * homepage stays short and routes people to it instead of repeating it.
 */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/" },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tSchedule = await getTranslations("scheduleBanner");

  const whyItems = t.raw("why.items") as { title: string; body: string }[];
  const stepItems = t.raw("process.steps") as { title: string; body: string }[];
  const steps = stepItems.map((s, i) => ({ ...s, step: String(i + 1) }));
  const faqItems = t.raw("faq") as { question: string; answer: string }[];

  return (
    <>
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="font-display text-lede text-burgundy-soft">
              {t("tagline")}
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-display lg:mx-0">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lede text-muted lg:mx-0">
              {t("lede")}
            </p>

            <p className="mt-6 text-sm text-muted">{t("languagesLine")}</p>
          </div>

          <Image
            src={images.hero}
            alt=""
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="aspect-[4/3] w-full rounded-2xl object-cover object-right shadow-[0_18px_40px_-20px_rgba(67,18,29,0.45)]"
          />
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:mx-0 lg:max-w-none">
          <CaseFinder />
          <Link
            href="/kontakt"
            className="shrink-0 rounded-lg bg-burgundy px-6 py-3 text-center text-white hover:bg-burgundy-deep"
          >
            {t("ctaDescribe")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-8">
        <Link
          href="/schedule-appointment"
          className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-burgundy bg-beige-pale px-6 py-6 sm:flex-row sm:items-center"
        >
          <span>
            <span className="block text-lg text-burgundy-deep group-hover:text-burgundy">
              {tSchedule("heading")}
            </span>
            <span className="mt-1 block text-sm text-muted">
              {tSchedule("body")}
            </span>
          </span>
          <span className="shrink-0 rounded-lg bg-burgundy px-6 py-3 text-sm font-medium text-white group-hover:bg-burgundy-deep">
            {tSchedule("cta")}
          </span>
        </Link>
      </section>

      <section
        aria-labelledby="dlaczego-naglowek"
        className="mx-auto max-w-5xl px-5 py-8"
      >
        <h2 id="dlaczego-naglowek" className="sr-only">
          {t("why.heading")}
        </h2>
        <ul className="grid gap-6 sm:grid-cols-3">
          {whyItems.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-rule bg-white p-6 transition duration-300 ease-out hover:z-10 hover:border-burgundy/40 hover:shadow-[0_22px_45px_-24px_rgba(67,18,29,0.5)] motion-safe:hover:scale-[1.06]"
            >
              <span aria-hidden="true" className="block h-0.5 w-10 bg-gold" />
              <h3 className="mt-4 text-lg text-burgundy-deep">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <GoogleReviewsSection locale={locale} />

      <section className="bg-beige-pale">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-title">{t("process.heading")}</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.step}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_-22px_rgba(67,18,29,0.45)] transition duration-300 hover:shadow-[0_22px_45px_-24px_rgba(67,18,29,0.5)] motion-safe:hover:-translate-y-1"
              >
                {images.processSteps[i] && (
                  <Image
                    src={images.processSteps[i]}
                    alt=""
                    placeholder="blur"
                    sizes="(min-width: 640px) 18rem, 100vw"
                    className="aspect-[3/2] w-full object-cover"
                  />
                )}
                <div className="flex-1 p-6">
                  <span className="inline-block rounded-full bg-beige-pale px-3 py-1 text-xs font-medium uppercase tracking-wider text-burgundy">
                    {t("process.stepLabel", { number: s.step })}
                  </span>
                  <h3 className="mt-3 text-lg">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        aria-labelledby="faq-naglowek"
        className="mx-auto max-w-3xl px-5 py-16"
      >
        <h2 id="faq-naglowek" className="text-title">
          {t("faqHeading")}
        </h2>
        <div className="mt-10 divide-y divide-rule border-y border-rule">
          {faqItems.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-burgundy-deep">
                {item.question}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-burgundy-soft group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
