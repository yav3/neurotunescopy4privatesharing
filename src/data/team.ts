// Single source of truth for staff profiles.
// Any UI that lists team members MUST import from here — do not redefine these
// fields inline in components, otherwise UI surfaces will desync.
import yasmineHeadshot from "@/assets/team/yasmine-wilt-2026.jpeg";
import mikeHeadshot from "@/assets/team/mike-larson-clean.jpg";
import chrisHeadshot from "@/assets/team/christopher-long-centered-v4.png";
import brianHeadshot from "@/assets/team/brian-wallace-2026.png";
import joshHeadshot from "@/assets/team/joshua-langenthal-centered.jpeg";
import peterHeadshot from "@/assets/team/peter-blumen-new.png";
import jimHeadshot from "@/assets/team/jim-anderson-new.png";
import marcinHeadshot from "@/assets/team/marcin-waryszak-centered.png";
import paulHeadshot from "@/assets/team/paul-korner.jpeg";
import hansHeadshot from "@/assets/team/hans-lindroth.jpeg";

export interface TeamMember {
  /** Stable identifier — use for keys and cross-references. */
  id: string;
  name: string;
  credentials?: string;
  role: string;
  title?: string;
  photo?: string;
  /** CSS object-position for the headshot crop. */
  objectPosition?: string;
  /** Optional zoom factor applied to the headshot. */
  scale?: number;
}

/**
 * Ordered roster. The array order IS the display order across every surface.
 * Edit here only — never duplicate this list in a component.
 */
export const TEAM: TeamMember[] = [
  { id: "yasmine-wilt",       name: "Yasmine Wilt",       credentials: "PhD",          role: "Co-Founder",                         title: "CEO, CTO",                  photo: yasmineHeadshot, objectPosition: "center 30%" },
  { id: "christopher-long",   name: "Christopher Long",   credentials: "MBA",          role: "CFO, COO",                                                       photo: chrisHeadshot,   objectPosition: "center center" },
  { id: "jim-anderson",       name: "Jim Anderson",                                    role: "Co-Founder",                                                     photo: jimHeadshot,     objectPosition: "center 30%" },
  { id: "joshua-langenthal",  name: "Joshua Langenthal",  credentials: "MCRP, MLA",    role: "",                                                               photo: joshHeadshot,    objectPosition: "center center" },
  { id: "mike-larson",        name: "Mike Larson",                                     role: "Chief Sound Officer",        title: '"The Minister of Sound"',   photo: mikeHeadshot,    objectPosition: "center 25%", scale: 1.5 },
  { id: "brian-wallace",      name: "Brian E. Wallace",   credentials: "MD, PhD, MBA", role: "Chief Research Officer",                                         photo: brianHeadshot,   objectPosition: "center 30%" },
  { id: "peter-blumen",       name: "Peter Blumen",       credentials: "ScM, MBA",     role: "Co-Founder",                                                     photo: peterHeadshot,   objectPosition: "center 30%" },
  { id: "marcin-waryszak",    name: "Marcin Waryszak",                                 role: "SVP Operations",                                                 photo: marcinHeadshot,  objectPosition: "center center" },
  { id: "paul-korner",        name: "Paul Korner",        credentials: "MD, MBA",      role: "Chief Medical Officer, President",                               photo: paulHeadshot,    objectPosition: "center 25%" },
  { id: "hans-lindroth",      name: "Hans Lindroth",                                   role: "Strategic Advisor",                                              photo: hansHeadshot,    objectPosition: "center 20%" },
];
