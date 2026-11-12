import { joveDayRules, teacherTraining, trainingRules } from "@/lib/content/business";
import { FREE_SHIPPING_ABOVE } from "@/lib/shop";
import { formatINR } from "@/lib/utils";

/**
 * Enquiry types shown as tabs on /contact. Plain serializable data (no icons) so the server page can
 * build it from the single source of truth in business.ts and hand it to the client tab component.
 */
/** "workshop" is the school enquiry (kits and teacher training since Nov 2026); the id stays so old links keep working. */
export const contactTabIds = ["workshop", "kits", "partner", "general"] as const;
export type ContactTabId = (typeof contactTabIds)[number];
export type LeadKind = "workshop" | "kits" | "studio" | "partner" | "contact";

export interface ContactTabData {
  id: ContactTabId;
  /** Short label on the tab. */
  label: string;
  kind: LeadKind;
  title: string;
  blurb: string;
  points: string[];
  submitLabel: string;
}

export function parseContactTab(value: string | string[] | undefined): ContactTabId {
  const v = Array.isArray(value) ? value[0] : value;
  return (contactTabIds as readonly string[]).includes(v ?? "") ? (v as ContactTabId) : "workshop";
}

export function buildContactTabs(): ContactTabData[] {
  return [
    {
      id: "workshop",
      label: "Kits + training",
      kind: "workshop",
      title: "Kits and teacher training for your school",
      blurb: "Tell us a little about your school. A founder will call you, understand your classes and come back with a written quote.",
      points: [
        `Class sets of kits for Grades 1–10 at the school price, from ${trainingRules.minimumKits} kits (GST included).`,
        `Teacher training at ${teacherTraining.price} plus GST, ${teacherTraining.hours} hours on your campus, from ${teacherTraining.minimumTeachers} teachers. A ${joveDayRules.advancePercent}% advance confirms the order.`,
        "Lesson plans, teacher certificates and a short film of the training day are included.",
      ],
      submitLabel: "Request a quote",
    },
    {
      id: "kits",
      label: "Bulk kits",
      kind: "kits",
      title: "Robotics kits for your school or club",
      blurb: "Ordering for a classroom, a tinkering lab or a whole grade? Tell us the kit and the quantity and we will send a quote.",
      points: [
        "Four kits, from the Spark Kit for Grades 1–2 to the Innovator AI Kit for Grades 9–10.",
        "Single kits can be ordered straight from the online store, no enquiry needed.",
        `Store orders ship free above ${formatINR(FREE_SHIPPING_ABOVE)}; bulk orders are quoted individually.`,
      ],
      submitLabel: "Request a kit quote",
    },
    {
      id: "partner",
      label: "Partnerships & CSR",
      kind: "partner",
      title: "Partnerships, CSR and sponsorships",
      blurb: "Want to sponsor kits and teacher training for under-resourced schools, partner on a programme or collaborate with us? Start the conversation here.",
      points: [
        "CSR-sponsored kits and teacher training for schools that could not otherwise afford them.",
        "Education, technology and community partners.",
        "We reply with how we could work together, in writing, so your team can review.",
      ],
      submitLabel: "Start a conversation",
    },
    {
      id: "general",
      label: "General",
      kind: "contact",
      title: "Anything else",
      blurb: "A question that does not fit the other tabs, press, feedback or something we have not thought of. Write to us and we will point you in the right direction.",
      points: [
        "Trainer or creative roles? See our careers page.",
        "Verifying a certificate? Use the certificate checker.",
        "Order questions: include your order number.",
      ],
      submitLabel: "Send message",
    },
  ];
}
