import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ContactForm } from "@/components/contact-form";
import { site } from "@/content/site";
import { images } from "@/content/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/kontakt" },
  };
}

const cardClass =
  "group flex h-full flex-col rounded-2xl border border-rule bg-white p-6 hover:border-burgundy";

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tFooter = await getTranslations("footer");
  const tMaps = await getTranslations("maps");

  const steps = t.raw("steps") as { title: string; body: string }[];

  // Each card body: title, one line of context, and the action as a link.
  const cardBody = (key: "book" | "form" | "phone" | "email", detail?: string) => (
    <>
      <span className="font-display text-lg text-burgundy-deep group-hover:text-burgundy">
        {t(`methods.${key}.title`)}
      </span>
      <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {t(`methods.${key}.body`)}
      </span>
      {detail && (
        <span className="mt-3 break-all text-sm font-medium text-ink">{detail}</span>
      )}
      <span className="mt-4 text-sm font-medium text-burgundy">
        {t(`methods.${key}.cta`)} →
      </span>
    </>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 pt-14">
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <h1 className="text-title sm:text-display">{t("title")}</h1>
          <p className="mt-5 max-w-xl text-lede leading-relaxed text-muted">
            {t("intro")}
          </p>
        </div>
        <Image
          src={images.contact}
          alt=""
          placeholder="blur"
          loading="eager"
          sizes="(min-width: 768px) 20rem, 100vw"
          className="aspect-[3/2] w-full rounded-2xl object-cover"
        />
      </div>

      <section aria-labelledby="metody-naglowek" className="mt-12">
        <h2 id="metody-naglowek" className="text-xl">
          {t("methodsHeading")}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <Link href="/schedule-appointment" className={cardClass}>
              {cardBody("book")}
            </Link>
          </li>
          <li>
            <a href="#formularz" className={cardClass}>
              {cardBody("form")}
            </a>
          </li>
          <li>
            <a href={`tel:${site.contact.phoneHref}`} className={cardClass}>
              {cardBody("phone", site.contact.phone)}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} className={cardClass}>
              {cardBody("email", site.contact.email)}
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-16 rounded-2xl bg-beige-pale px-6 py-10 sm:px-10">
        <h2 className="text-title">{t("stepsHeading")}</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title}>
              <span className="font-display text-title text-burgundy-soft">
                {i + 1}
              </span>
              <h3 className="mt-2 text-lg">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="formularz" aria-labelledby="formularz-naglowek" className="mt-16">
        <h2 id="formularz-naglowek" className="text-title">
          {t("formHeading")}
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{t("formIntro")}</p>

        <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_18rem]">
          <Suspense fallback={<p className="text-muted">{t("loadingForm")}</p>}>
            <ContactForm />
          </Suspense>

          <aside className="lg:border-l lg:border-rule lg:pl-8">
            <h2 className="text-lg">{t("directHeading")}</h2>
            <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-muted">
              <p>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="text-burgundy underline-offset-4 hover:underline"
                >
                  {site.contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-burgundy underline-offset-4 hover:underline"
                >
                  {site.contact.email}
                </a>
              </p>
              <p className="pt-3">
                {site.contact.street}
                <br />
                {site.contact.postcode} {site.contact.city}
              </p>
              <p>
                <a
                  href={site.maps.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy underline-offset-4 hover:underline"
                >
                  {tMaps("open")} →
                </a>
              </p>
            </address>

            <h2 className="mt-8 text-lg">{t("hoursHeading")}</h2>
            <dl className="mt-4 space-y-2 text-sm text-muted">
              <div>
                <dt>{tFooter("hours.weekdays")}</dt>
                <dd className="text-ink">{tFooter("hours.weekdaysTime")}</dd>
              </div>
              <div>
                <dt>{tFooter("hours.saturday")}</dt>
                <dd className="text-ink">{tFooter("hours.saturdayTime")}</dd>
              </div>
            </dl>

            <h2 className="mt-8 text-lg">{t("languagesHeading")}</h2>
            <p className="mt-3 text-sm text-muted">{t("languagesList")}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
