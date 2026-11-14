import { site } from "@/content/site";

/**
 * Reviews from the firm's Google Business listing, via the Places API (New).
 * Fetched on the server and cached, so visitors' browsers never talk to
 * Google — no cookies, nothing to add to the consent banner.
 *
 * Needs GOOGLE_PLACES_API_KEY. GOOGLE_PLACE_ID is optional: without it the
 * listing is looked up once per cache period by name and location. Returns
 * null when not configured or when Google is unreachable, and the page shows
 * a link to the reviews on Google instead.
 */

const API = "https://places.googleapis.com/v1";
// Google's terms allow short-lived caching; refresh a few times a day.
const REVALIDATE_SECONDS = 60 * 60 * 6;

export type GoogleReview = {
  author: string;
  authorUrl?: string;
  rating: number;
  text: string;
  when: string;
  url?: string;
};

export type GoogleReviews = {
  rating: number;
  count: number;
  reviews: GoogleReview[];
  mapsUrl: string;
  writeReviewUrl: string;
};

type PlaceResponse = {
  id: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string };
    googleMapsUri?: string;
  }[];
};

async function findPlaceId(key: string): Promise<string | null> {
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id",
    },
    body: JSON.stringify({
      textQuery: site.maps.searchQuery,
      pageSize: 1,
      locationBias: { circle: { center: site.maps.location, radius: 300 } },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { places?: { id: string }[] };
  return data.places?.[0]?.id ?? null;
}

export async function getGoogleReviews(locale: string): Promise<GoogleReviews | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  try {
    const placeId = process.env.GOOGLE_PLACE_ID || (await findPlaceId(key));
    if (!placeId) return null;

    const res = await fetch(
      `${API}/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(locale)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "id,rating,userRatingCount,googleMapsUri,reviews",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) return null;
    const place = (await res.json()) as PlaceResponse;
    if (!place.rating || !place.userRatingCount) return null;

    return {
      rating: place.rating,
      count: place.userRatingCount,
      mapsUrl: place.googleMapsUri ?? site.maps.url,
      writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(place.id)}`,
      reviews: (place.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "",
          authorUrl: r.authorAttribution?.uri,
          rating: r.rating ?? 0,
          // `text` is translated into the page language when Google can.
          text: r.text?.text ?? r.originalText?.text ?? "",
          when: r.relativePublishTimeDescription ?? "",
          url: r.googleMapsUri,
        }))
        .filter((r) => r.author && r.text),
    };
  } catch {
    return null;
  }
}
