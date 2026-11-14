import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingEmbed } from "@/components/booking-embed";
import { images } from "@/content/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schedulePage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/schedule-appointment" },
  };
}

export default async function ScheduleAppointmentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("schedulePage");

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14 pb-4">
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="max-w-3xl">
          <h1 className="text-title sm:text-display">{t("title")}</h1>
          <p className="mt-5 text-lede leading-relaxed text-muted">{t("intro")}</p>

          <aside className="mt-6 flex gap-4 rounded-2xl border border-burgundy/30 bg-beige-pale p-5">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-burgundy font-display text-white"
            >
              zł
            </span>
            <span>
              <span className="block font-display text-lg text-burgundy-deep">
                {t("payment.heading")}
              </span>
              <span className="mt-1 block leading-relaxed text-ink">
                {t("payment.body")}
              </span>
            </span>
          </aside>
        </div>
        <Image
          src={images.appointment}
          alt=""
          placeholder="blur"
          loading="eager"
          sizes="(min-width: 768px) 20rem, 100vw"
          className="aspect-[3/2] w-full rounded-2xl object-cover"
        />
      </div>

      <BookingEmbed />
    </div>
  );
}
