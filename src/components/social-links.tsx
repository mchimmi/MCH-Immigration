import { site } from "@/content/site";

/**
 * Facebook and Instagram icon links. Brand names are used as the accessible
 * labels — they are the same in every language the site is offered in.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  const linkClass =
    "flex size-9 items-center justify-center rounded-lg text-burgundy-soft hover:bg-beige-pale hover:text-burgundy";

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <a
        href={site.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={linkClass}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
          <path d="M13.5 21.95v-7.7h2.6l.4-3.02h-3V9.3c0-.87.24-1.47 1.5-1.47h1.6V5.13c-.28-.04-1.23-.12-2.33-.12-2.3 0-3.88 1.4-3.88 3.98v2.24H7.8v3.02h2.6v7.7C5.62 21.3 2 17.08 2 12 2 6.48 6.48 2 12 2s10 4.48 10 10c0 5.08-3.62 9.3-8.5 9.95Z" />
        </svg>
      </a>
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={linkClass}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
