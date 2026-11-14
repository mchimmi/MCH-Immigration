import { getTranslations } from "next-intl/server";
import { site } from "@/content/site";
import { getGoogleReviews } from "@/lib/google-reviews";

/**
 * "Feedback from our clients" on the homepage. Shows the live Google rating
 * and recent reviews when the Places API is configured; otherwise a card that
 * sends visitors to the reviews on Google. Never shows invented content.
 */
export async function GoogleReviewsSection({ locale }: { locale: string }) {
  const t = await getTranslations("home.reviews");
  const tMaps = await getTranslations("maps");
  const data = await getGoogleReviews(locale);

  const linkButton =
    "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors";

  return (
    <section aria-labelledby="opinie-naglowek" className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 id="opinie-naglowek" className="text-title">
            {t("heading")}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">{t("intro")}</p>
        </div>
        <GoogleBadge label={t("googleLabel")} />
      </div>

      {data ? (
        <div className="mt-10 grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-burgundy-deep p-7 text-white">
            <div>
              <p className="font-display text-6xl leading-none">
                {data.rating.toFixed(1)}
              </p>
              <Stars
                rating={data.rating}
                label={t("ratingLabel", { rating: data.rating.toFixed(1) })}
                className="mt-3"
              />
              <p className="mt-3 text-sm text-white/75">
                {t("summary", { rating: data.rating.toFixed(1), count: data.count })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={data.writeReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkButton} bg-white text-burgundy-deep hover:bg-beige`}
              >
                {t("write")}
              </a>
              <a
                href={data.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkButton} text-white underline-offset-4 hover:underline`}
              >
                {t("seeAll")} →
              </a>
            </div>
          </div>

          <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:mx-0 lg:px-0">
            {data.reviews.map((review) => (
              <li
                key={`${review.author}-${review.when}`}
                className="flex w-[19rem] shrink-0 snap-start flex-col rounded-2xl border border-rule bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-burgundy/40 hover:shadow-[0_18px_40px_-24px_rgba(67,18,29,0.45)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-beige font-display text-lg text-burgundy-deep"
                  >
                    {review.author.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    {review.authorUrl ? (
                      <a
                        href={review.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="block truncate font-medium text-ink hover:text-burgundy"
                      >
                        {review.author}
                      </a>
                    ) : (
                      <span className="block truncate font-medium text-ink">{review.author}</span>
                    )}
                    <span className="block text-xs text-muted">{review.when}</span>
                  </span>
                </div>
                <Stars
                  rating={review.rating}
                  label={t("ratingLabel", { rating: review.rating })}
                  className="mt-4"
                />
                <p className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-muted">
                  “{review.text}”
                </p>
                {review.url && (
                  <a
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-medium text-burgundy underline-offset-4 hover:underline"
                  >
                    {t("readMore")}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-burgundy-deep p-8 text-white">
            <div>
              <span aria-hidden="true" className="block font-display text-6xl leading-none text-gold">
                “
              </span>
              <h3 className="mt-2 font-display text-2xl text-white">{t("fallbackTitle")}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-white/80">{t("fallbackBody")}</p>
            </div>
            <a
              href={site.maps.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkButton} self-start bg-white text-burgundy-deep hover:bg-beige`}
            >
              {t("seeAll")} →
            </a>
          </div>

          <LocationCard heading={t("findUs")} openLabel={tMaps("open")} />
        </div>
      )}
    </section>
  );
}

function LocationCard({ heading, openLabel }: { heading: string; openLabel: string }) {
  return (
    <a
      href={site.maps.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-rule bg-beige-pale p-8 transition duration-300 hover:-translate-y-1 hover:border-burgundy/40 hover:shadow-[0_18px_40px_-24px_rgba(67,18,29,0.45)]"
    >
      {/* A drawn street grid with a pin: suggests a map without loading one. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 320 200"
        className="absolute inset-0 h-full w-full text-rule"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
          <path d="M-20 60 L340 30" />
          <path d="M-20 150 L340 120" />
          <path d="M70 -20 L110 220" />
          <path d="M210 -20 L250 220" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7">
          <path d="M-20 105 L340 75" />
          <path d="M150 -20 L180 220" />
        </g>
        <g transform="translate(176 52)" className="text-burgundy">
          <path
            d="M0 0c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34C20 9 11 0 0 0z"
            fill="currentColor"
          />
          <circle cx="0" cy="20" r="7" fill="#fff" />
        </g>
      </svg>
      <span className="relative">
        <span className="block font-display text-lg text-burgundy-deep">{heading}</span>
        <span className="mt-1 block text-sm text-ink">
          {site.contact.street}, {site.contact.postcode} {site.contact.city}
        </span>
        <span className="mt-3 inline-block text-sm font-medium text-burgundy group-hover:underline group-hover:underline-offset-4">
          {openLabel} →
        </span>
      </span>
    </a>
  );
}

function Stars({
  rating,
  label,
  className = "",
}: {
  rating: number;
  label: string;
  className?: string;
}) {
  const width = `${Math.max(0, Math.min(5, rating)) * 20}%`;
  const star =
    "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z";
  const row = (fill: string) => (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 shrink-0">
          <path d={star} fill={fill} />
        </svg>
      ))}
    </span>
  );

  return (
    <span
      className={`relative inline-block text-gold ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="opacity-30">{row("currentColor")}</span>
      <span className="absolute inset-0 overflow-hidden" style={{ width }}>
        {row("currentColor")}
      </span>
    </span>
  );
}

function GoogleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-rule bg-white px-4 py-2 text-sm text-ink">
      <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.2l7.9 6.2C12.4 13.7 17.7 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
        <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.2z" />
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-7.4-5.7c-2.1 1.4-4.8 2.2-8.4 2.2-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.2C6.6 42.6 14.6 48 24 48z" />
      </svg>
      {label}
    </span>
  );
}
