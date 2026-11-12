/**
 * The designs of Social Studio, part 1: the school announcement, hiring, milestone, photo post, kit post,
 * quote, "Learn with JOVE" list, video thumbnail, photo collage and the carousel.
 *
 * A design is a list of boxes to fill in, a layout from layouts.ts, and a caption in the house structure.
 * Nothing here invents a fact: numbers, names and quotes are what the person types, and kit prices are read from
 * the price list the website uses.
 */
import { kits } from "@/lib/content/business";
import { collage, figure, list, photo, point, poster, quote, thumb } from "../layouts";
import type { FieldSpec, TemplateDef, Values } from "../types";
import { CTAS, WATCH, bareSite, caption, choice, dateHero, dotDate, hashtags, linesOf, longDate, rupees, shortDate, splitLine, val } from "../words";

const picture = (key: string, label: string, help?: string): FieldSpec => ({ key, label, kind: "image", help });

/* ───────────────────────────── a teacher training at a school ───────────────────────────── */

const STAGES: Record<string, { label: string; tag: string; eyebrow: string; sub: string }> = {
  coming: { label: "Coming soon", tag: "Teacher training · Announcement", eyebrow: "We are training the teachers of", sub: "Hands-on Robotics and AI training, so every class can build with JOVE kits all year." },
  today: { label: "Today", tag: "Teacher training · Today", eyebrow: "Today, teacher training at", sub: "Every teacher builds every project, then teaches one back. The camera is rolling." },
  thanks: { label: "Thank you", tag: "Teacher training · Thank you", eyebrow: "Thank you", sub: "For a day of building and teaching. Classes start next week, and the film is on its way." },
};
const ALL_GRADES = "Grades 1 to 10";
/** kept for posts saved before Nov 2026, whose line may still say "every grade group" */
const forGrades = (line: string, grades: string) => (grades ? line.replace("for every grade group", `for ${grades}`) : line);

const joveDay: TemplateDef = {
  id: "jove-day",
  name: "Teacher training at a school",
  group: "Announcements",
  blurb: "We are training a school's teachers soon, today, or thank you: one design for all three.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite", "photo"],
  fields: [
    { key: "stage", label: "What is the post saying?", kind: "select", options: Object.entries(STAGES).map(([value, s]) => ({ value, label: s.label })) },
    { key: "school", label: "School", kind: "text", placeholder: "School name, as the school writes it", help: "Name a school only after it has approved the post.", max: 48 },
    { key: "city", label: "City or town", kind: "text", placeholder: "Bagalkot", max: 28 },
    { key: "date", label: "Date", kind: "date" },
    { key: "grades", label: "Grades the kits are for", kind: "text", placeholder: ALL_GRADES, help: `Leave empty for ${ALL_GRADES}. Type it only when the school ordered kits for some of its grades.`, max: 20 },
    { key: "line", label: "One line (optional)", kind: "textarea", rows: 2, placeholder: "Leave empty for the standard line", max: 150 },
    picture("picture", "Picture (optional)", "A photo of the training, with the teachers' consent. With the Photo look it fills the frame."),
  ],
  sample: { stage: "coming", school: "Your school's name", city: "City", date: "2026-11-14", grades: "", line: "" },
  draw(p, { values: v, pictures, facts }) {
    const stage = choice(STAGES, val(v, "stage")) ?? STAGES.coming;
    const date = val(v, "date");
    const base = { tag: stage.tag, index: dotDate(date), foot: bareSite(facts.website) };
    const sub = val(v, "line") || forGrades(stage.sub, val(v, "grades"));
    const school = val(v, "school") || "School name";
    if (p.tone === "photo") {
      photo(p, { ...base, headline: school, sub: `${stage.eyebrow.replace(/,? at$| to$/i, "")}. ${sub}`, chips: [longDate(date), val(v, "city")], picture: pictures.picture });
      return;
    }
    poster(p, {
      ...base,
      eyebrow: stage.eyebrow,
      headline: school,
      sub,
      hero: dateHero(date),
      picture: pictures.picture,
      facts: [
        { label: "Date", value: longDate(date) },
        { label: "Where", value: val(v, "city") },
        { label: "For", value: val(v, "grades") || ALL_GRADES },
      ],
      cta: val(v, "stage") === "thanks" ? "Get a quote" : undefined,
    });
  },
  caption(v) {
    const school = val(v, "school") || "[School]";
    const when = longDate(val(v, "date")) || "[date]";
    const stage = val(v, "stage");
    const grades = val(v, "grades");
    if (stage === "today")
      return caption({ hook: `Today at ${school}: the teachers are building.`, body: [grades ? `Kits for ${grades}: every teacher builds every project and teaches one back.` : "Every teacher builds every project, from a first circuit to a camera that learns to see, and teaches one back.", "The film of the day follows."], credit: true, cta: CTAS.follow, tags: hashtags("robotics", "schools", "studio") });
    if (stage === "thanks")
      return caption({ hook: `Thank you, ${school}.`, body: ["Your teachers built, tested and taught every project. They are certified, and the kits are ready for class.", "The film of the training is being edited now."], credit: true, cta: CTAS.book, tags: hashtags("robotics", "schools", "studio") });
    return caption({ hook: `On ${when} we train the teachers of ${school}.`, body: [grades ? `Robotics and AI kits for ${grades}, and hands-on training for the teachers who will teach them.` : "Robotics and AI kits for their classes, and hands-on training for the teachers who will teach them.", "Our own film studio records the training for the school."], credit: true, cta: CTAS.book, tags: hashtags("robotics", "schools") });
  },
};

/* ───────────────────────────── hiring ───────────────────────────── */

const ROLES: Record<string, { label: string; line: string }> = {
  trainer: { label: "Freelance Teacher Trainer (Robotics and AI)", line: "Train school teachers to teach JOVE kits. Kits, plans and training are ours; the patience and the energy are yours." },
  lead: { label: "Lead Trainer", line: "Lead teacher trainings, coach the trainers and keep every build working." },
  editor: { label: "Editor Intern (FrameMind AI Studio)", line: "Cut the films of real teacher trainings at schools, with our in-house studio." },
  partnerships: { label: "Partnerships Associate", line: "Meet principals, explain kits and teacher training honestly and help schools order." },
  other: { label: "Another role (type it below)", line: "Help bring Robotics and AI kits, and trained teachers, to schools." },
};

/** The careers page the hiring QR code opens: the box on the design, else the JOVE careers page. */
const CAREERS = "https://www.jove.website/careers";
function careersLink(v: Record<string, string>) {
  const typed = val(v, "link");
  if (!typed) return CAREERS;
  return /^https?:\/\//i.test(typed) ? typed : `https://${typed}`;
}
/** "https://www.jove.website/careers" → "jove.website/careers" */
const shown = (url: string) => url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "");

const hiring: TemplateDef = {
  id: "hiring",
  name: "We are hiring",
  group: "Hiring",
  blurb: "One open role: what it is, where, and how to apply.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "role", label: "Role", kind: "select", options: Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label })) },
    { key: "title", label: "Role name (only for another role)", kind: "text", placeholder: "Operations Intern", max: 40 },
    { key: "kind", label: "Type", kind: "select", options: ["Freelance", "Full-time", "Part-time", "Internship"].map((value) => ({ value, label: value })) },
    { key: "place", label: "Where", kind: "text", placeholder: "Bagalkot, Karnataka", max: 30 },
    { key: "by", label: "Apply by", kind: "date" },
    { key: "line", label: "About the role (optional)", kind: "textarea", rows: 2, placeholder: "Leave empty for the standard line", max: 150 },
    { key: "points", label: "What we look for (one per line, up to 3)", kind: "textarea", rows: 3, max: 70 },
    { key: "apply", label: "How to apply (optional)", kind: "text", placeholder: "Leave empty for the careers page", max: 44 },
    { key: "link", label: "QR code opens", kind: "text", placeholder: "https://www.jove.website/careers", max: 80 },
  ],
  sample: { role: "trainer", title: "", kind: "Freelance", place: "Karnataka", by: "2026-11-30", line: "", points: "Comfortable teaching children from Grade 1 to 10\nBasic electronics or Arduino\nKannada and English", apply: "" },
  draw(p, { values: v, facts }) {
    const role = choice(ROLES, val(v, "role")) ?? ROLES.trainer;
    const title = val(v, "role") === "other" ? val(v, "title") || "Role name" : role.label;
    const link = careersLink(v);
    const apply = val(v, "apply");
    poster(p, {
      tag: "We are hiring",
      index: val(v, "kind"),
      foot: bareSite(facts.website),
      eyebrow: "Open role",
      headline: title,
      sub: val(v, "line") || role.line,
      bullets: linesOf(v, "points").slice(0, 3),
      facts: [
        { label: "Type", value: val(v, "kind") },
        { label: "Where", value: val(v, "place") },
        { label: "Apply by", value: shortDate(val(v, "by")) },
      ],
      cta: apply ? `Apply: ${apply}` : "Apply now",
      qr: { url: link, note: `Scan, or visit ${shown(link)}` },
    });
  },
  caption(v) {
    const role = choice(ROLES, val(v, "role")) ?? ROLES.trainer;
    const title = val(v, "role") === "other" ? val(v, "title") || "[role]" : role.label;
    const apply = val(v, "apply") || shown(careersLink(v));
    const by = shortDate(val(v, "by"));
    return caption({
      hook: `We are hiring: ${title}.`,
      body: [val(v, "line") || role.line, [val(v, "kind"), val(v, "place")].filter(Boolean).join(" · "), ...linesOf(v, "points").slice(0, 3).map((l) => `· ${l}`)],
      cta: `To apply: ${apply}${by ? ` by ${by}` : ""}.`,
      tags: hashtags("hiring", "robotics"),
    });
  },
};

/* ───────────────────────────── milestone ───────────────────────────── */

const milestone: TemplateDef = {
  id: "milestone",
  name: "Milestone",
  group: "Milestones",
  blurb: "One real number and what it means.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "figure", label: "The number", kind: "text", placeholder: "01", help: "Only a number that is true today. We never round up or borrow someone else's.", max: 7 },
    { key: "unit", label: "What it counts", kind: "text", placeholder: "Teachers trained", max: 22 },
    { key: "label", label: "Headline", kind: "text", placeholder: "Our first teachers are trained", max: 56 },
    { key: "line", label: "One line (optional)", kind: "textarea", rows: 2, max: 140 },
    { key: "date", label: "As of (date)", kind: "date" },
  ],
  // nothing is filled in for you: a milestone that opens with a number in it would be a claim nobody made
  sample: { figure: "", unit: "", label: "", line: "", date: "" },
  draw(p, { values: v, facts }) {
    const empty = !val(v, "figure") && !val(v, "unit") && !val(v, "label");
    figure(p, { tag: "Milestone", index: dotDate(val(v, "date")), foot: bareSite(facts.website), figure: val(v, "figure") || "00", unit: val(v, "unit") || (empty ? "What it counts" : ""), label: val(v, "label") || "Your headline", sub: val(v, "line") });
  },
  caption(v) {
    const count = [val(v, "figure"), val(v, "unit")].filter(Boolean).join(" ");
    const asOf = shortDate(val(v, "date"));
    return caption({ hook: val(v, "label") || count || "[Headline]", body: [val(v, "line"), count && `${count}${asOf ? `, as of ${asOf}` : ""}.`], cta: CTAS.follow, tags: hashtags("robotics", "schools") });
  },
};

/* ───────────────────────────── photo post ───────────────────────────── */

const MOMENTS: Record<string, string> = {
  build: "Build moment",
  lens: "Behind the lens",
  day: "Training day",
  studio: "Studio day",
  kit: "Kit build",
  team: "Team",
};

const moment: TemplateDef = {
  id: "photo-post",
  name: "Photo post",
  group: "Behind the scenes",
  blurb: "A photo or a frame from a video, with a headline on it.",
  formats: ["post", "square", "story", "wide"],
  tones: ["photo"],
  fields: [
    picture("picture", "Photo, or a video to take a frame from", "Photos of children need the school's consent. No name, class or crest without approval."),
    { key: "kind", label: "What it shows", kind: "select", options: Object.entries(MOMENTS).map(([value, label]) => ({ value, label })) },
    { key: "headline", label: "Headline (up to 8 words)", kind: "text", placeholder: "The moment the motor spins", max: 60 },
    { key: "line", label: "One line (optional)", kind: "textarea", rows: 2, max: 140 },
    { key: "date", label: "Date (optional)", kind: "date" },
    { key: "place", label: "Place (optional)", kind: "text", max: 28 },
  ],
  // no line about the picture here: it would stay on the design after a real photo is added (the picture box and the stamp say it)
  sample: { kind: "build", headline: "The moment the motor spins", line: "", date: "", place: "" },
  stock: () => ({ picture: "/images/studio/kids-build.webp" }),
  draw(p, { values: v, pictures, facts }) {
    photo(p, { tag: choice(MOMENTS, val(v, "kind")) ?? MOMENTS.build, index: dotDate(val(v, "date")), foot: bareSite(facts.website), headline: val(v, "headline") || "Headline", sub: val(v, "line"), chips: [val(v, "place")], picture: pictures.picture });
  },
  caption(v) {
    const lens = val(v, "kind") === "lens" || val(v, "kind") === "studio";
    // the credit belongs to a training day: a studio day, a kit on a desk or a team photo is not one
    return caption({ hook: val(v, "headline") || "[The moment, not the company]", body: [val(v, "line"), [val(v, "place"), shortDate(val(v, "date"))].filter(Boolean).join(" · ")], credit: ["build", "day", "lens"].includes(val(v, "kind") || "build"), cta: lens ? CTAS.follow : CTAS.book, tags: lens ? hashtags("studio", "robotics") : hashtags("robotics", "schools") });
  },
};

/* ───────────────────────────── kits ───────────────────────────── */

const KIT_STATUS: Record<string, string> = {
  ready: "Kits are ready",
  shipping: "Now shipping",
  stock: "Back in stock",
  packing: "Packing the first batch",
  soon: "Coming soon",
};
const kitOf = (v: Values) => kits.find((k) => k.id === val(v, "kit")) ?? kits[0];
/** the kit's project and grades as a sentence writes them: "Robot and Fan Hat", "Grades 1 to 2" */
const kitProject = (k: { project: string }) => k.project.replace(/\s\+\s/g, " and ");
const kitGrades = (k: { grades: string }) => k.grades.split("·")[0].trim().replace(/\s*[–-]\s*/g, " to ");

const kitPost: TemplateDef = {
  id: "kit",
  name: "Kit post",
  group: "Kits",
  blurb: "A kit is ready, shipping, back in stock or coming soon. The price is read from the price list.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "kit", label: "Kit", kind: "select", options: kits.map((k) => ({ value: k.id, label: k.name })) },
    { key: "status", label: "What is the news?", kind: "select", options: Object.entries(KIT_STATUS).map(([value, label]) => ({ value, label })) },
    { key: "line", label: "One line (optional)", kind: "textarea", rows: 2, placeholder: "Leave empty for the kit's own line", max: 130 },
    picture("picture", "Your photo of the kit (optional)", "Without one, the kit's drawing is used and labelled as an illustration."),
  ],
  sample: { kit: "spark", status: "ready", line: "" },
  stock: (v) => ({ picture: kitOf(v).image }),
  draw(p, { values: v, pictures, facts }) {
    const kit = kitOf(v);
    poster(p, {
      tag: "JOVE Kits",
      index: kit.sku,
      foot: bareSite(facts.website),
      eyebrow: choice(KIT_STATUS, val(v, "status")) ?? KIT_STATUS.ready,
      headline: kit.name,
      sub: val(v, "line") || `${kitProject(kit)}. Everything in the box.`,
      picture: pictures.picture,
      facts: [
        { label: "For", value: kitGrades(kit) },
        { label: "Price", value: `${rupees(kit.mrp)} incl. GST` },
      ],
      cta: val(v, "status") === "soon" || val(v, "status") === "packing" ? undefined : "Shop JOVE Kits",
    });
  },
  caption(v) {
    const kit = kitOf(v);
    return caption({ hook: `${choice(KIT_STATUS, val(v, "status")) ?? "JOVE Kits"}: ${kit.name}.`, body: [val(v, "line") || `${kitProject(kit)}, everything in the box, ${kitGrades(kit)}.`, `${rupees(kit.mrp)} incl. GST. Build it, test it, show it off.`], cta: CTAS.shop, tags: hashtags("kits", "robotics") });
  },
};

/* ───────────────────────────── quote ───────────────────────────── */

const quoteCard: TemplateDef = {
  id: "quote",
  name: "Quote",
  group: "Words",
  blurb: "Someone's own words: a founder, a principal, a teacher. Only what was really said.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "kind", label: "Whose words?", kind: "select", options: [{ value: "founder", label: "A founder" }, { value: "school", label: "A school (testimonial)" }, { value: "team", label: "Someone on the team" }] },
    { key: "quote", label: "The words", kind: "textarea", rows: 4, help: "Exactly as said or written, and with the person's permission. Never write a testimonial for someone.", max: 260 },
    { key: "name", label: "Name", kind: "text", max: 40 },
    { key: "role", label: "Role and place", kind: "text", placeholder: "Founder & CEO, JOVE", max: 48 },
    picture("portrait", "Portrait (optional)"),
  ],
  // no words are filled in for you: a quote that opens ready-made is a quote nobody said
  sample: { kind: "founder", quote: "", name: "", role: "" },
  draw(p, { values: v, pictures, facts }) {
    const tag = val(v, "kind") === "school" ? "In their words" : val(v, "kind") === "team" ? "The team" : "Founders and craft";
    quote(p, { tag, foot: bareSite(facts.website), quote: val(v, "quote") || "The words go here.", name: val(v, "name") || "Name", role: val(v, "role"), portrait: pictures.portrait });
  },
  caption(v) {
    const who = [val(v, "name"), val(v, "role")].filter(Boolean).join(", ");
    return caption({ hook: `“${val(v, "quote") || "[the words]"}”`, body: [who ? `${who}.` : ""], credit: val(v, "kind") === "school", cta: val(v, "kind") === "school" ? CTAS.book : CTAS.follow, tags: val(v, "kind") === "founder" ? hashtags("founders", "robotics") : hashtags("robotics", "schools") });
  },
};

/* ───────────────────────────── learn with JOVE ───────────────────────────── */

const learn: TemplateDef = {
  id: "learn",
  name: "Learn with JOVE",
  group: "Words",
  blurb: "A mini-lesson on one slide: a title and three to five numbered points.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "title", label: "Title", kind: "text", placeholder: "How a robot decides", max: 54 },
    { key: "points", label: "Points, one per line. Add a line about it after a | sign.", kind: "textarea", rows: 5, placeholder: "Sense | A sensor measures the world", max: 90 },
    { key: "cta", label: "Call to action", kind: "select", options: [{ value: "", label: "None" }, { value: "Try the free Virtual Lab", label: "Try the free Virtual Lab" }, { value: "Save for science week", label: "Save for science week" }, { value: "Get a quote", label: "Get a quote" }] },
  ],
  sample: { title: "How a robot decides", points: "Sense | A sensor measures light, distance or sound.\nThink | A small program compares it with a rule.\nAct | A motor, a light or a buzzer responds.", cta: "Try the free Virtual Lab" },
  draw(p, { values: v, facts }) {
    list(p, { tag: "Learn with JOVE", foot: bareSite(facts.website), eyebrow: "Mini-lesson", title: val(v, "title") || "Title", items: linesOf(v, "points").map(splitLine), cta: val(v, "cta") || undefined });
  },
  caption(v) {
    const items = linesOf(v, "points").map(splitLine);
    return caption({ hook: `${val(v, "title") || "[Title]"}: ${items.map((i) => i.title.toLowerCase()).join(", ")}.`, body: items.map((i, n) => `${n + 1}. ${i.title}${i.text ? `: ${i.text}` : ""}`), cta: val(v, "cta").includes("Lab") ? CTAS.learn : /Book|quote/.test(val(v, "cta")) ? CTAS.book : CTAS.save, tags: hashtags("robotics", "ai") });
  },
};

/* ───────────────────────────── video thumbnail ───────────────────────────── */

const thumbnail: TemplateDef = {
  id: "thumbnail",
  name: "Video thumbnail",
  group: "Video",
  blurb: "YouTube thumbnail or Reel cover: a frame from the video and a few words. Two at most on YouTube.",
  formats: ["wide", "story", "post", "square"],
  tones: ["photo"],
  fields: [
    picture("picture", "Photo, or the video to take a frame from"),
    { key: "words", label: "Words (two on YouTube, up to six on a Reel cover)", kind: "text", placeholder: "It works", max: 30 },
    { key: "series", label: "Line above (optional)", kind: "text", placeholder: "Behind the lens", max: 30 },
    { key: "badge", label: "Corner note (optional)", kind: "text", placeholder: "EP 03", max: 8 },
  ],
  sample: { words: "It works", series: "Build with JOVE", badge: "EP 01" },
  stock: () => ({ picture: "/images/studio/trainer-class.webp" }),
  draw(p, { values: v, pictures }) {
    thumb(p, { words: val(v, "words") || "Two words", series: val(v, "series"), badge: val(v, "badge"), picture: pictures.picture });
  },
  caption(v) {
    return caption({ hook: `${val(v, "words") || "[Title]"}.`, body: [val(v, "series") ? `${val(v, "series")}${val(v, "badge") ? `, ${val(v, "badge")}` : ""}.` : ""], cta: WATCH, tags: hashtags("studio", "robotics") });
  },
};

/* ───────────────────────────── photo collage ───────────────────────────── */

const photos: TemplateDef = {
  id: "collage",
  name: "Photo collage",
  group: "Behind the scenes",
  blurb: "Two to four photos of one day under a title.",
  formats: ["post", "square", "story", "wide"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "title", label: "Title", kind: "text", placeholder: "Packing day", max: 40 },
    { key: "line", label: "One line (optional)", kind: "textarea", rows: 2, max: 110 },
    { key: "date", label: "Date (optional)", kind: "date" },
    picture("a", "Photo 1"),
    picture("b", "Photo 2"),
    picture("c", "Photo 3 (optional)"),
    picture("d", "Photo 4 (optional)"),
  ],
  sample: { title: "Behind the lens", line: "", date: "" },
  stock: () => ({ a: "/images/studio/media-crew.webp", b: "/images/studio/drone-campus.webp", c: "/images/studio/trainer-class.webp" }),
  draw(p, { values: v, pictures, facts }) {
    const all = [pictures.a, pictures.b, pictures.c, pictures.d];
    const used = all.filter(Boolean).length;
    collage(p, { tag: "Behind the scenes", index: dotDate(val(v, "date")), foot: bareSite(facts.website), title: val(v, "title") || "Title", sub: val(v, "line"), pictures: used >= 2 ? all.filter(Boolean) : all.slice(0, 2) });
  },
  caption(v) {
    return caption({ hook: `${val(v, "title") || "[Title]"}.`, body: [val(v, "line"), shortDate(val(v, "date"))], cta: CTAS.follow, tags: hashtags("studio", "robotics") });
  },
};

/* ───────────────────────────── carousel ───────────────────────────── */

const slidesOf = (v: Values) => linesOf(v, "points").map(splitLine).slice(0, 8);

const carousel: TemplateDef = {
  id: "carousel",
  name: "Carousel",
  group: "Words",
  blurb: "A hook, one point per slide, and a last slide that asks for one action. Downloads as a set.",
  formats: ["post", "square", "story"],
  tones: ["paper", "graphite"],
  fields: [
    { key: "tag", label: "Topic", kind: "select", options: ["Learn with JOVE", "For schools", "Teacher training", "Behind the lens", "Founders and craft"].map((value) => ({ value, label: value })) },
    { key: "hook", label: "First slide: the hook", kind: "text", placeholder: "A teacher training, hour by hour", help: "A question or a surprising line.", max: 60 },
    { key: "line", label: "First slide: one line under it (optional)", kind: "textarea", rows: 2, max: 120 },
    { key: "points", label: "One slide per line (up to 8). Add the text after a | sign, 25 words at most.", kind: "textarea", rows: 6, max: 190 },
    { key: "cta", label: "Last slide: the one action", kind: "select", options: ["Get a quote", "Try the free Virtual Lab", "Shop JOVE Kits", "Save this for later", "Send this to your coordinator"].map((value) => ({ value, label: value })) },
  ],
  sample: {
    tag: "Teacher training",
    hook: "A teacher training, hour by hour",
    line: "One school, one day, every grade.",
    points: "Set-up | The team arrives early and builds the stations in two halls.\nOpening show | A robot and drone show for the whole school.\nSessions | Each grade group builds, tests and fixes its own project.\nShowcase | Students present what they built and receive certificates.",
    cta: "Get a quote",
  },
  pages: (v) => slidesOf(v).length + 2,
  draw(p, { values: v, page, pages, facts }) {
    const slides = slidesOf(v);
    const base = { tag: val(v, "tag") || "JOVE", index: `${String(page + 1).padStart(2, "0")} / ${String(pages).padStart(2, "0")}`, foot: bareSite(facts.website) };
    if (page === 0) poster(p, { ...base, eyebrow: "Swipe to read", headline: val(v, "hook") || "The hook", sub: val(v, "line"), dim: `${slides.length} ${slides.length === 1 ? "point" : "points"}` });
    else if (page <= slides.length) point(p, { ...base, number: String(page).padStart(2, "0"), title: slides[page - 1].title, text: slides[page - 1].text, more: true });
    else poster(p, { ...base, eyebrow: "Your turn", headline: val(v, "cta") || "Get a quote", sub: /Lab/.test(val(v, "cta")) ? "Free, in the browser, no sign-up." : /Kits/.test(val(v, "cta")) ? "Everything in the box, by age." : /Book|quote/.test(val(v, "cta")) ? "Kits for Grades 1 to 10, and teachers trained to teach them." : "", cta: /Save|Send/.test(val(v, "cta")) ? undefined : "Link in bio" });
  },
  caption(v) {
    const slides = slidesOf(v);
    const cta = val(v, "cta");
    return caption({ hook: val(v, "hook") || "[The hook]", body: [val(v, "line"), ...slides.map((s, n) => `${n + 1}. ${s.title}`)], credit: ["Teacher training", "JOVE Day"].includes(val(v, "tag")), cta: /Lab/.test(cta) ? CTAS.learn : /Kits/.test(cta) ? CTAS.shop : /Save/.test(cta) ? CTAS.save : /Send/.test(cta) ? CTAS.share : CTAS.book, tags: hashtags("robotics", "schools") });
  },
};

export const CORE_TEMPLATES: TemplateDef[] = [joveDay, hiring, milestone, moment, kitPost, quoteCard, learn, thumbnail, photos, carousel];
