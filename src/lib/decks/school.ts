/**
 * The school meeting deck: what a principal or the management sees when a founder visits.
 * Since Nov 2026 JOVE supplies kits and trains the school's teachers, so the deck sells kits + teacher training.
 * Every price and number comes from the price book; nothing claims schools, results or testimonials JOVE does not have.
 */
import { gradeBands, joveDayRules, kits, offers, teacherTraining, trainingFilm, trainingRules } from "@/lib/content/business";
import { formatINR } from "@/lib/utils";
import type { Deck } from "./types";

const kitFor = (kitId: string) => kits.find((k) => k.id === kitId);

export const schoolDeck: Deck = {
  id: "school-meeting",
  group: "school",
  title: "JOVE for your school",
  audience: "Principals, correspondents and management",
  blurb: "The meeting deck: the gap, who we are, the kits by grade, the teacher training, the training film, safety, prices and next steps. Type the school's name and it appears on the cover.",
  minutes: 15,
  theme: { accent: "#2b2b2b", tint: "#ede7da", level: 4, palette: ["#2b2b2b", "#7a5c2e", "#3d5a80"] },
  sources: ["07_SCHOOL_PROPOSALS/07_Pitch_Deck_Script_10_Slides.md", "08_SALES_CRM (objection guide)"],
  slides: ({ school }) => [
    {
      kind: "cover",
      kicker: school ? `Prepared for ${school}` : "Robotics · AI · Machine Learning",
      title: "Robotics & AI in every class, taught by your own teachers.",
      sub: "Kits for Grades 1 to 10, and training that certifies your teachers",
      art: "/images/hero/hero-arm.webp",
      notes: "Thank you for your time. In 15 minutes I want to show you the kits, how we train your teachers to teach with them, and what it costs. Then I would love your questions.",
    },
    {
      kind: "cards",
      title: "The gap schools tell us about",
      cards: [
        { icon: "GraduationCap", title: "NEP 2020", text: "asks for experiential, skill-based learning" },
        { icon: "Users", title: "Parents", text: "ask about robotics and AI at admissions time" },
        { icon: "Wrench", title: "Kits on the shelf", text: "teachers rarely get the time or help to learn them" },
      ],
      notes: "Ask first: “Do you have kits or an ATL today? How often are they used?” Listen. Their answer is the real slide; keep this one short.",
    },
    {
      kind: "cards",
      title: "Who we are",
      cards: [
        { icon: "Bot", title: "JOVE", text: "Robotics & AI kits for Grades 1–10, with lesson plans for every project" },
        { icon: "Users", title: "Founders in the room", text: "A founder is at every teacher training" },
        { icon: "Film", title: "FrameMind AI Studio", text: "Our own studio films your teachers' training day" },
      ],
      sub: "A new company, launched in 2026",
      notes: "Be upfront: “We are a new company. That is why a founder is at every training, and why we let you try everything first.” Show the free 3D bench on the website, and a kit on the table.",
    },
    {
      kind: "table",
      title: "A kit for every grade",
      head: ["Grades", "Programme", "Kit", "School price"],
      rows: gradeBands.map((b) => [b.grades, b.name, kitFor(b.kitId)?.name ?? "—", kitFor(b.kitId) ? formatINR(kitFor(b.kitId)!.schoolPrice) : "—"]),
      foot: `GST included · school prices from ${trainingRules.minimumKits} kits in one order · a printed guide and lesson plans with every kit`,
      notes: "Hand them the kit for the grade they care about most. “One kit per team; teams of two to four. The kits are reused year after year.”",
    },
    {
      kind: "points",
      title: `${teacherTraining.name}`,
      points: teacherTraining.includes,
      icon: "GraduationCap",
      notes: `“In ${teacherTraining.hours} hours on your campus, every teacher builds every project themselves and teaches one back. They leave with lesson plans and a JOVE certificate.”`,
    },
    {
      kind: "points",
      title: "We bring · you provide",
      points: [
        "We bring: the kits, a JOVE trainer, tools and spares, lesson plans, certificates and the film crew",
        "You provide: a room with tables, a few power points, a projector, and the teachers free for the training",
        "After the training, your teachers run the classes; we check in a few weeks later",
      ],
      icon: "Package",
    },
    {
      kind: "cards",
      title: "Your training day, on film",
      cards: trainingFilm.items.map((m, i) => ({ icon: (["Clapperboard", "Camera"] as const)[i % 2], title: m.title, text: m.detail })),
      sub: "Included with Kits + Teacher Training, by FrameMind AI Studio",
      notes: "“Your teachers, building robots: content for your website and admissions season.” Show a sample from the studio reel and say clearly that it is a sample, not their school. Teachers who do not want to appear are left out.",
    },
    {
      kind: "cards",
      title: "Safety",
      cards: [
        { icon: "Battery", title: "Low-voltage kits", text: "Battery or USB power only; no soldering, no mains for children" },
        { icon: "ShieldCheck", title: "Verified trainers", text: "Background checks and child-protection training for every JOVE trainer" },
        { icon: "ClipboardList", title: "Trained for class", text: "Teachers learn safe handling and running hands-on classes" },
      ],
      notes: "If asked about filming: “We film only the teachers, with the school's permission. Anyone can ask to be left out.”",
    },
    {
      kind: "table",
      title: "Investment",
      head: ["What", "Price", "Note"],
      rows: [
        ...kits.map((k) => [k.name, formatINR(k.schoolPrice), `per kit, GST incl. · MRP ${formatINR(k.mrp)}`]),
        [teacherTraining.name, teacherTraining.price, `before GST · from ${teacherTraining.minimumTeachers} teachers`],
      ],
      foot: `${joveDayRules.advancePercent}% advance confirms the order · balance within ${joveDayRules.balanceDueDays} days of the training · GST ${joveDayRules.gstPercent}% on training`,
      notes: "Do the arithmetic for their school aloud: kits for the grades they want, plus their teachers, on the estimator at jove.website/packages.",
    },
    {
      kind: "cards",
      title: "Four ways to start",
      cards: offers.map((o, i) => ({ icon: (["Handshake", "Package", "GraduationCap", "Wrench"] as const)[i % 4], title: o.name, text: o.priceNote })),
      notes: "“Most schools take kits and training together. If you already have kits or an ATL, the training alone works too.”",
    },
    {
      kind: "steps",
      title: "Next steps",
      steps: [
        { title: "Choose the kits", detail: "By grade, how many teams", icon: "Package" },
        { title: "Teachers to train", detail: "Names and a date", icon: "Users" },
        { title: "Quote and advance", detail: `${joveDayRules.advancePercent}% confirms the order`, icon: "Handshake" },
        { title: "Kits arrive, teachers trained", detail: "Classes start the week after", icon: "CalendarDays" },
      ],
      notes: "Ask for the decision: “Which grades would you like to start with, and how many teachers?” If they hesitate, offer a demo for teachers with one kit. Note every concern and answer with the objection guide in 08_SALES_CRM.",
    },
    {
      kind: "closing",
      title: "Thank you",
      sub: "jove.website",
      points: ["Questions?", "Try the free 3D bench: jove.website/labs", "Estimate for your school: jove.website/packages"],
    },
  ],
};
