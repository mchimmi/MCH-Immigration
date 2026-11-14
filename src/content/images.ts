/**
 * Photography used across the site. Static imports so next/image knows each
 * file's size (no layout shift) and can generate a blur placeholder.
 *
 * The photos are illustrative, not informative, so they render with empty
 * alt text and do not need translating in messages/*.json.
 */

import type { StaticImageData } from "next/image";
import type { ServiceSlug } from "./services";

import heroLawDesk from "@/images/hero-law-desk.jpg";
import stepConsultation from "@/images/step-consultation.jpg";
import stepApplication from "@/images/step-application.jpg";
import stepProceedings from "@/images/step-proceedings.jpg";
import aboutTeam from "@/images/about-team.jpg";
import aboutHandshake from "@/images/about-handshake.jpg";
import knowledgeBase from "@/images/knowledge-base.jpg";
import contact from "@/images/contact.jpg";
import appointment from "@/images/appointment.jpg";
import residenceCard from "@/images/service-residence-card.jpg";
import permanentResidence from "@/images/service-permanent-residence.jpg";
import workPermit from "@/images/service-work-permit.jpg";
import family from "@/images/service-family.jpg";
import drivingLicence from "@/images/service-driving-licence.jpg";
import pesel from "@/images/service-pesel.jpg";
import trustedProfile from "@/images/service-trusted-profile.jpg";

export const images = {
  hero: heroLawDesk,
  /** One per step of home.process.steps, in order. */
  processSteps: [stepConsultation, stepApplication, stepProceedings],
  aboutTeam,
  aboutHandshake,
  knowledgeBase,
  contact,
  appointment,
};

export const serviceImages: Record<ServiceSlug, StaticImageData> = {
  "karta-pobytu-czasowego": residenceCard,
  "pobyt-staly": permanentResidence,
  "zezwolenie-na-prace": workPermit,
  "zaproszenie-dla-rodziny": family,
  "wymiana-prawa-jazdy": drivingLicence,
  "pesel-i-meldunek": pesel,
  "profil-zaufany": trustedProfile,
};
