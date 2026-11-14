import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serviceSlugs } from "@/content/services";
import { images, serviceImages } from "@/content/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "knowledgeBase" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: "/uslugi" },
  };
}

export default async function KnowledgeBasePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("knowledgeBase");
  const tServices = await getTranslations("services");

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
          src={images.knowledgeBase}
          alt=""
          placeholder="blur"
          loading="eager"
          sizes="(min-width: 768px) 20rem, 100vw"
          className="aspect-[3/2] w-full rounded-2xl object-cover"
        />
      </div>

      <ul className="mt-14 border-t border-burgundy/25">
        {serviceSlugs.map((slug) => (
          <li key={slug} className="border-b border-burgundy/25">
            <Link
              href={`/uslugi/${slug}`}
              className="group grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-2 py-7 sm:grid-cols-[8rem_minmax(0,16rem)_1fr] sm:gap-x-10"
            >
              <Image
                src={serviceImages[slug]}
                alt=""
                placeholder="blur"
                sizes="(min-width: 640px) 8rem, 5rem"
                className="row-span-2 aspect-[4/3] w-full rounded-lg object-cover transition-opacity group-hover:opacity-85 sm:row-span-1"
              />
              <h2 className="text-title text-burgundy-deep group-hover:text-burgundy">
                {tServices(`${slug}.title`)}
              </h2>
              <p className="max-w-xl self-center leading-relaxed text-muted">
                {tServices(`${slug}.summary`)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
