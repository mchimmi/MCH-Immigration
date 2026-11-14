/**
 * Facts about the firm that do not change with the site's language: legal
 * identity, contact details, postal address. Everything that IS language —
 * tagline, descriptions, nav labels, hours in prose — lives in
 * messages/*.json instead. See src/content/services.ts for why the
 * procedure list moved out too.
 */

export const site = {
  name: "MCH Kancelaria Imigracyjna",
  shortName: "MCH",

  contact: {
    // TODO: replace with real details
    email: "office@mchimmigration.pl",
    // `phoneHref` is the same number without spaces, for tel: links.
    phone: "+48 537 635 151",
    phoneHref: "+48537635151",
    // Postal addresses are not translated — mail is addressed in the local
    // administrative language regardless of the page the visitor reads.
    street: "Złota 7",
    postcode: "00-019",
    city: "Warszawa",
  },

  /** The office's Google Business listing. */
  maps: {
    url: "https://maps.app.goo.gl/AbYzMfoRMFXVJHY27",
    // Used to look up the listing in the Places API when GOOGLE_PLACE_ID is
    // not set (see src/lib/google-reviews.ts).
    searchQuery: "MCH Immigration Kancelaria Prawa Imigracyjnego, Złota 7, Warszawa",
    location: { latitude: 52.2326267, longitude: 21.0120725 },
  },

  social: {
    facebook: "https://www.facebook.com/mchimmigration",
    instagram: "https://www.instagram.com/mchimmigration",
  },

  /** Google Calendar appointment schedule shown on /schedule-appointment. */
  booking: {
    embedUrl:
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3NN4wtQVpFF7vua5hjIppPwbV-WtcTlK6eRIUMsKRJ3fOQYNOmYsx7tqY_sq_CZzE5UXTs9cME?gv=true",
    // The same schedule as a standalone Google page, offered to visitors who
    // have not consented to embedded third-party content.
    pageUrl:
      "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3NN4wtQVpFF7vua5hjIppPwbV-WtcTlK6eRIUMsKRJ3fOQYNOmYsx7tqY_sq_CZzE5UXTs9cME",
  },

  /**
   * RODO / legal footer. Polish law requires identifying the entity behind a
   * commercial site. TODO: confirm the exact legal form and numbers.
   */
  legal: {
    entity: "MCH Kancelaria Imigracyjna",
    nip: "9512657535",
    regon: "545902120",
    // If the practice is run by an adwokat or radca prawny, the bar
    // registration details belong here too, and the professional advertising
    // rules apply to all copy on this site.
    barInfo: null as string | null,
  },
} as const;
