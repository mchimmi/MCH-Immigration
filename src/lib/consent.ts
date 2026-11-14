"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent, stored in a first-party cookie so the choice survives
 * reloads and is readable on every page. Under the ePrivacy Directive
 * (Art. 5(3)) and GDPR, anything not strictly necessary may only run after
 * an explicit opt-in — so the only optional category here, embedded
 * third-party content (the Google Calendar booking widget), defaults to off.
 *
 * Bump CONSENT_VERSION whenever a new category or third party is added; old
 * choices are then ignored and the banner asks again.
 */

const COOKIE_NAME = "mch_consent";
const CONSENT_VERSION = 1;
// Six months, after which the visitor is asked again.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

const CHANGE_EVENT = "mch:consent-change";
const OPEN_SETTINGS_EVENT = "mch:open-cookie-settings";

export type Consent = {
  v: number;
  /** Embedded third-party content that sets its own cookies (Google Calendar). */
  external: boolean;
  /** When the choice was made — kept as a record of consent. */
  date: string;
};

function readRaw(): string {
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return match ? match.slice(COOKIE_NAME.length + 1) : "";
}

function parse(raw: string): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Consent;
    return value.v === CONSENT_VERSION ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { external: boolean }) {
  const value: Consent = {
    v: CONSENT_VERSION,
    external: choice.external,
    date: new Date().toISOString(),
  };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(value),
  )}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/**
 * The visitor's current choice: `null` when they have not chosen yet, and
 * `undefined` during server rendering and hydration, when it is unknown —
 * callers should render nothing consent-dependent in that state.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore<string | undefined>(
    subscribe,
    readRaw,
    () => undefined,
  );
  return raw === undefined ? undefined : parse(raw);
}

/** Reopens the banner — used by the "Cookie settings" link in the footer. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, handler);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler);
}
