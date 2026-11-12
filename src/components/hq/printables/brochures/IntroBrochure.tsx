"use client";

/**
 * "Meet JOVE" — the introduction brochure a founder hands to a principal at a first meeting.
 * Theme: Blueprint (light). Warm paper, a 5 mm drawing grid, a sheet frame, pencil drawings that sit
 * directly on the grid, and two solid graphite blocks (the training film inside, the contact block on the back).
 *
 * A3 landscape, two sheets, folded once to A4:
 *   OUTSIDE — back cover (left half) · front cover (right half)
 *   INSIDE  — kits + teacher training, the training, the four kits, what students and the school take away
 * (Since Nov 2026 JOVE supplies kits and trains the school's teachers; there are no student workshop days.)
 *
 * Every size is in mm / pt and every box has a fixed position, so the sheet prints exactly as it previews.
 * Every number is imported from the content files; nothing is typed by hand.
 */
import Image from "next/image";
import { Film, Images, type LucideIcon } from "lucide-react";
import { gradeBands, joveDayRules, kits, teacherTraining, trainingFilm, trainingRules, type GradeBandId } from "@/lib/content/business";
import { labs } from "@/lib/content/labs";
import { site } from "@/lib/site";
import { cn, formatINR } from "@/lib/utils";
import { Wordmark } from "../PrintBits";
import type { Q } from "../util";
import { BrochureShell, Half, Qr, Spread, sessionLength, useBrochureInfo, useQr, type BrochureInfo } from "./BrochureBits";

/* ───────────────────────────── numbers, all from the content files ───────────────────────────── */

const gradeNumbers = gradeBands.flatMap((b) => (b.grades.match(/\d+/g) ?? []).map(Number));
const GRADE_MIN = Math.min(...gradeNumbers);
const GRADE_MAX = Math.max(...gradeNumbers);
const KIT_SCHOOL_FROM = Math.min(...kits.map((k) => k.schoolPrice));
const SESSION_MIN = Math.min(...gradeBands.map((b) => b.durationMin));
const SESSION_MAX = Math.max(...gradeBands.map((b) => b.durationMin));
const TEAM_MIN = Math.min(...gradeBands.map((b) => b.studentsPerStation));
const TEAM_MAX = Math.max(...gradeBands.map((b) => b.studentsPerStation));
const TEAM_SIZE = TEAM_MIN === TEAM_MAX ? `${TEAM_MIN}` : `${TEAM_MIN}–${TEAM_MAX}`;
const FREE_LABS = labs.filter((l) => l.free).length;
const KIT_FROM = Math.min(...kits.map((k) => k.mrp));

const band = (id: GradeBandId) => gradeBands.find((b) => b.id === id) ?? gradeBands[0];

/** 75 → "1 h 15 min" · 180 → "3 hours" (the same on every brochure) */
const lasts = sessionLength;
const plain = (s: string) => s.replace(/\s\+\s/g, " and ").replace(/\s&\s/g, " and ");
/** up to the first full stop that ends a sentence (so "S. S." or "Dr." inside a name does not cut it short) */
const firstSentence = (s: string) => /^.*?[.!?](?=\s+[A-Z][a-z]|\s*$)/.exec(s)?.[0] ?? s;

const filmIcon = (title: string): LucideIcon => (/photo/i.test(title) ? Images : Film);

/* ───────────────────────────── geometry helpers (millimetres) ───────────────────────────── */

const mm = (v: number) => `${Math.round(v * 100) / 100}mm`;
/** absolute box: left, top, width and (optionally) height in mm */
const at = (x: number, y: number, w: number, h?: number): React.CSSProperties => ({ left: mm(x), top: mm(y), width: mm(w), ...(h === undefined ? {} : { height: mm(h) }) });

/**
 * Drawing paper: a 5 mm grid with a heavier line every 30 mm, drawn as real lines (CSS gradient grids vanish in the PDF).
 * The fold (210 mm) and the sheet frame sit on grid lines.
 */
const SHEET = { w: 420, h: 296.6 };
const GRID = (() => {
  let minor = "";
  let major = "";
  for (let x = 5; x < SHEET.w; x += 5) {
    const d = `M${x} 0V${SHEET.h}`;
    if (x % 30 === 0) major += d;
    else minor += d;
  }
  for (let k = 0; 0.8 + k * 5 < SHEET.h; k++) {
    const d = `M0 ${Math.round((0.8 + k * 5) * 10) / 10}H${SHEET.w}`;
    if (k % 6 === 2) major += d;
    else minor += d;
  }
  return { minor, major };
})();

/** Turns the pencil drawings' own paper to white so that, multiplied onto the sheet, only the pencil lines remain. */
const pencil = (lift: number) => `grayscale(1) brightness(${lift}) contrast(1.12)`;

/* ───────────────────────────── blueprint furniture ───────────────────────────── */

/** The sheet: drawing grid and the frame every engineering sheet carries. */
function Ground() {
  return (
    <>
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${SHEET.w} ${SHEET.h}`} preserveAspectRatio="none" fill="none" stroke="#2b2b2b">
        <path d={GRID.minor} strokeWidth={0.13} strokeOpacity={0.085} />
        <path d={GRID.major} strokeWidth={0.16} strokeOpacity={0.16} />
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-x-[10mm] inset-y-[10.8mm] border-[0.25mm] border-graphite/60" />
    </>
  );
}

/** Section tag: a boxed number and a mono label, like a view label on a drawing. */
function Tag({ n, children, light, className }: { n: string; children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={cn("flex items-center gap-[2mm] font-mono text-[6.8pt] font-medium uppercase leading-none tracking-[0.17em]", light ? "text-paper/75" : "text-charcoal", className)}>
      <span className={cn("grid h-[4.4mm] min-w-[6.6mm] place-items-center border-[0.25mm] px-[1mm] tracking-[0.04em]", light ? "border-paper/70 text-paper" : "border-graphite bg-white text-graphite")}>{n}</span>
      <span>{children}</span>
    </p>
  );
}

/** Page number in the top corner. */
function Folio({ n, className }: { n: number; className?: string }) {
  return <p className={cn("absolute top-[16.6mm] font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal", className)}>Meet JOVE · {n} / 4</p>;
}

/** A dimension line: end ticks, arrowheads and a label in the middle. */
function Dim({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <span className={cn("flex items-center text-graphite", className)}>
      <span aria-hidden className="h-[3mm] w-[0.22mm] shrink-0 bg-current" />
      <span aria-hidden className="relative h-[0.22mm] flex-1 bg-current">
        <span className="absolute left-0 top-1/2 size-0 -translate-y-1/2 border-y-[0.65mm] border-r-[2mm] border-y-transparent border-r-current" />
      </span>
      {children && <span className="mx-[2.2mm] shrink-0 font-mono text-[6.8pt] font-medium uppercase leading-none tracking-[0.17em]">{children}</span>}
      <span aria-hidden className="relative h-[0.22mm] flex-1 bg-current">
        <span className="absolute right-0 top-1/2 size-0 -translate-y-1/2 border-y-[0.65mm] border-l-[2mm] border-y-transparent border-l-current" />
      </span>
      <span aria-hidden className="h-[3mm] w-[0.22mm] shrink-0 bg-current" />
    </span>
  );
}

/** Numbered callout: the same number marks a session on the timetable and its drawing. */
function Callout({ n, size = 4.6, light }: { n: number | string; size?: number; light?: boolean }) {
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-mono font-medium leading-none", light ? "border-[0.25mm] border-graphite bg-white text-graphite" : "bg-graphite text-paper")}
      style={{ width: mm(size), height: mm(size), fontSize: `${Math.max(6.5, size * 1.5)}pt` }}
    >
      {n}
    </span>
  );
}

/** L-shaped marks at the four corners of a figure. */
function Corners({ arm = 3.2 }: { arm?: number }) {
  const s = { width: mm(arm), height: mm(arm) };
  const c = "absolute border-graphite/70";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span className={cn(c, "left-0 top-0 border-l-[0.25mm] border-t-[0.25mm]")} style={s} />
      <span className={cn(c, "right-0 top-0 border-r-[0.25mm] border-t-[0.25mm]")} style={s} />
      <span className={cn(c, "bottom-0 left-0 border-b-[0.25mm] border-l-[0.25mm]")} style={s} />
      <span className={cn(c, "bottom-0 right-0 border-b-[0.25mm] border-r-[0.25mm]")} style={s} />
    </span>
  );
}

/** One of the pencil drawings, placed straight onto the sheet (no box around it). */
function Drawing({ src, sizes = "1200px", lift = 1.17, fit = "cover", position }: { src: string; sizes?: string; lift?: number; fit?: "cover" | "contain"; position?: string }) {
  return <Image src={src} alt="" aria-hidden fill sizes={sizes} quality={90} loading="eager" className={cn("mix-blend-multiply", fit === "cover" ? "object-cover" : "object-contain")} style={{ filter: pencil(lift), objectPosition: position }} />;
}

/**
 * The rupee sign, drawn. "₹" is missing from the subsets of both web fonts, so a typed one falls back to whatever
 * font the computer has; at display size that shows. Sized to the capital height of the mono digits beside it.
 */
function Rupee() {
  return (
    <svg aria-hidden viewBox="0 0 56 73" className="mr-[0.05em] inline-block h-[0.73em] w-[0.56em] align-baseline" fill="none" stroke="currentColor" strokeWidth="9.4" strokeLinejoin="bevel">
      <path d="M4 4.7H52M4 23.5H52M4 4.7H20a18.8 18.8 0 0 1 0 37.6H8L36 72" />
    </svg>
  );
}

/** A display price in the mono face: drawn rupee sign + the digits from formatINR. */
function Money({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("whitespace-nowrap font-mono font-medium leading-none tracking-[-0.05em]", className)}>
      <Rupee />
      {formatINR(value).replace(/^[^\d]+/, "")}
    </span>
  );
}

/** A point in a list: bold claim, one or two plain sentences. */
function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-[5mm]">
      <span aria-hidden className="absolute left-0 top-[1.25mm] size-[1.8mm] bg-graphite" />
      <p className="text-[9.4pt] font-bold leading-[1.22] tracking-[-0.01em]">{title}</p>
      <p className="mt-[0.5mm] text-[8.8pt] leading-[1.38]">{children}</p>
    </li>
  );
}

/* ───────────────────────────── OUTSIDE · front cover (right half) ───────────────────────────── */

function FrontCover({ info }: { info: BrochureInfo }) {
  const school = info.school.length > 128 ? `${info.school.slice(0, 126).trimEnd()}…` : info.school;
  const schoolPt = school.length <= 40 ? 11.5 : school.length <= 90 ? 9.6 : 8.2;
  return (
    <>
      {/* the drawing: a robot arm standing on the title block */}
      <div aria-hidden className="absolute overflow-hidden" style={at(0, 126, 200, 136)}>
        <div className="absolute" style={at(-17, 6, 236, 131.8)}>
          <Drawing src="/images/hero/hero-arm.webp" sizes="2400px" lift={1.21} fit="contain" />
        </div>
      </div>

      <Wordmark mm={46} className="absolute left-[12mm] top-[16mm]" />
      <p className="absolute right-[15mm] top-[16.6mm] text-right font-mono text-[6.5pt] uppercase leading-[1.7] tracking-[0.17em] text-charcoal">
        Meet JOVE
        <br />
        An introduction for schools
      </p>

      <p className="absolute flex items-center gap-[2.4mm] font-mono text-[7.6pt] font-medium uppercase leading-none tracking-[0.17em]" style={at(12, 48.5, 183)}>
        <span aria-hidden className="h-[0.3mm] w-[9mm] bg-graphite" />
        <span>
          Robotics · AI · Machine Learning kits and teacher training, Grades {GRADE_MIN} to {GRADE_MAX}
        </span>
      </p>

      <h1 className="absolute text-[46pt] font-bold leading-[0.98] tracking-[-0.035em]" style={at(12, 56, 185)}>
        <span className="block">Robotics in every</span>
        <span className="block">class, taught by</span>
        <span className="block">
          <span className="relative inline-block">
            your teachers.
            <span className="absolute inset-x-0 top-full block pt-[1.2mm] tracking-normal">
              <Dim>{teacherTraining.hours} hours of training</Dim>
            </span>
          </span>
        </span>
      </h1>

      <p className="absolute text-[10.5pt] font-medium leading-[1.42]" style={at(12, 116, 112)}>
        A kit for every team, from Grade {GRADE_MIN} to Grade {GRADE_MAX}, and hands-on training on your campus that certifies your teachers to teach with them.
      </p>

      {/* title block, in the corner of the frame where a drawing sheet keeps it */}
      <div className="absolute flex flex-col border-[0.3mm] border-graphite bg-white" style={at(12, 259, 188, 26.8)}>
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col justify-center px-[3.2mm]">
            <p className="font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal">{school ? "Prepared for" : "Document"}</p>
            <p className="mt-[1.5mm] font-bold leading-[1.14] tracking-[-0.01em]" style={{ fontSize: `${school ? schoolPt : 11.5}pt` }}>
              {school || "An introduction for principals and school management"}
            </p>
          </div>
          <div className="flex w-[40mm] shrink-0 flex-col justify-center border-l-[0.25mm] border-graphite px-[3.2mm]">
            <p className="font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal">For grades</p>
            <p className="mt-[1.5mm] font-mono text-[11.5pt] font-medium leading-none">
              {GRADE_MIN} to {GRADE_MAX}
            </p>
          </div>
          <div className="flex w-[32mm] shrink-0 flex-col justify-center border-l-[0.25mm] border-graphite pl-[3.2mm] pr-[5mm]">
            <p className="font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal">Sheet</p>
            <p className="mt-[1.5mm] font-mono text-[11.5pt] font-medium leading-none">1 of 4</p>
          </div>
        </div>
        <div className="flex h-[8.6mm] shrink-0 items-center justify-between bg-graphite pl-[3.2mm] pr-[5mm] font-mono text-[6.6pt] uppercase leading-none tracking-[0.2em] text-paper">
          <span>{site.tagline}</span>
          <span className="normal-case tracking-[0.06em]">{info.web}</span>
        </div>
      </div>
    </>
  );
}

/* ───────────────────────────── OUTSIDE · back cover (left half) ───────────────────────────── */

const STEPS: { title: string; text: string }[] = [
  { title: "We talk, then we visit", text: "We call you, then visit your campus with a kit, or walk you through the kits and the 3D bench online." },
  { title: "You get a written quote", text: `The kits for each grade, the teachers to train and the date, with GST shown line by line. School prices apply from ${trainingRules.minimumKits} kits; a training is for ${teacherTraining.minimumTeachers} teachers or more.` },
  { title: "Your order is confirmed", text: `A ${joveDayRules.advancePercent}% advance confirms it. We dispatch the kits and fix the training date.` },
  { title: "Teachers trained", text: `We train and certify your teachers on campus and film the day. The balance is due within ${joveDayRules.balanceDueDays} days of the training.` },
];

function BackCover({ info, qrSrc }: { info: BrochureInfo; qrSrc: string }) {
  const contact: { k: string; v: string }[] = [
    { k: "Call", v: info.phone },
    { k: "Write", v: info.email },
    { k: "Web", v: info.web },
  ].filter((r) => r.v);
  return (
    <>
      {/* 07 who we are */}
      <Tag n="07" className="absolute left-[15mm] top-[16mm]">
        Who we are
      </Tag>
      <Folio n={4} className="right-[12mm]" />
      <h2 className="absolute text-[22pt] font-bold leading-[1.02] tracking-[-0.03em]" style={at(15, 24.5, 183)}>
        A kits company with its own film studio.
      </h2>
      <div className="absolute text-[9.5pt] leading-[1.45]" style={at(15, 38.6, 88, 56)} data-fit="back-who">
        <p>JOVE stands for {site.expansion}. We are a young company with one job: to put real Robotics, AI and Machine Learning into every class, taught by the school&apos;s own teachers.</p>
        <p className="mt-[2.2mm]">{site.studio.name} is our in-house film studio. It films your teachers&apos; training day for the school.</p>
        <p className="mt-[2.2mm]">You deal with the founders directly, and a founder is at your school for the training.</p>
      </div>
      <ul className="absolute flex flex-col gap-[4.5mm]" style={at(110, 39.6, 88, 54)} data-fit="back-founders">
        {site.founders.map((f) => (
          <li key={f.id} className="flex gap-[3.6mm]">
            <span className="relative grid size-[13mm] shrink-0 place-items-center rounded-full border-[0.3mm] border-graphite bg-white font-mono text-[10pt] font-medium leading-none">
              <span aria-hidden className="absolute -inset-[1.5mm] rounded-full border-[0.2mm] border-dashed border-graphite/45" />
              {f.initials}
            </span>
            <div className="min-w-0">
              <p className="text-[10.5pt] font-bold leading-[1.15] tracking-[-0.01em]">{f.name}</p>
              <p className="mt-[0.9mm] font-mono text-[6.6pt] uppercase leading-none tracking-[0.14em] text-charcoal">{f.role}</p>
              <p className="mt-[1.3mm] text-[8.6pt] leading-[1.36]">{firstSentence(f.bio)}</p>
            </div>
          </li>
        ))}
      </ul>

      <span aria-hidden className="absolute h-[0.25mm] bg-graphite/60" style={at(15, 97, 183)} />

      {/* 08 after the day */}
      <Tag n="08" className="absolute left-[15mm] top-[101mm]">
        After the training
      </Tag>
      <div aria-hidden className="absolute" style={at(15, 108, 88, 43)}>
        <Drawing src="/images/kits/kit-knolling.webp" />
        <Corners />
      </div>
      <div className="absolute" style={at(15, 154.5, 88, 38)} data-fit="back-after">
        <h3 className="text-[12.5pt] font-bold leading-[1.1] tracking-[-0.02em]">Robotics every week, all year.</h3>
        <p className="mt-[1.4mm] text-[8.8pt] leading-[1.38]">
          The kits stay in your school. Our 3D bench is free at {info.web}/labs, with the same parts as our kits: teachers rehearse a build before class, and students try {FREE_LABS} builds at home.
        </p>
        <p className="mt-[1.4mm] text-[8.8pt] leading-[1.38]">
          Parents can buy the same {kits.length} kits for home, from {formatINR(KIT_FROM)} (MRP, GST included).
        </p>
      </div>

      {/* 09 first call to JOVE Day */}
      <Tag n="09" className="absolute left-[110mm] top-[101mm]">
        From first call to trained teachers
      </Tag>
      <span aria-hidden className="absolute w-[0.25mm] bg-graphite/60" style={{ left: "113.1mm", top: "112mm", height: "68mm" }} />
      <ol className="absolute flex flex-col justify-between" style={at(110, 108.5, 88, 84)} data-fit="back-steps">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex gap-[3.4mm]">
            <Callout n={i + 1} size={6.4} light />
            <div className="min-w-0">
              <p className="text-[9.6pt] font-bold leading-[1.2] tracking-[-0.01em]">{s.title}</p>
              <p className="mt-[0.5mm] text-[8.8pt] leading-[1.38]">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <span aria-hidden className="absolute h-[0.25mm] bg-graphite/60" style={at(15, 196, 183)} />

      {/* 10 the price pointer */}
      <Tag n="10" className="absolute left-[15mm] top-[200mm]">
        What it costs
      </Tag>
      <div className="absolute" style={at(15, 208.4, 88, 26)} data-fit="back-price-figure">
        <p className="font-mono text-[7pt] font-medium uppercase leading-none tracking-[0.15em]">Kits for schools, from</p>
        <p className="mt-[3mm] flex items-baseline gap-[2.8mm]">
          <Money value={KIT_SCHOOL_FROM} className="text-[42pt]" />
          <span className="text-[11pt] font-bold leading-none tracking-[-0.01em]">per kit</span>
        </p>
      </div>
      <div className="absolute text-[8.8pt] leading-[1.38]" style={at(110, 207.6, 88, 28)} data-fit="back-price">
        <p>
          GST included, from {trainingRules.minimumKits} kits. Teacher training is {formatINR(teacherTraining.pricePerTeacher)} per teacher plus GST, from {teacherTraining.minimumTeachers} teachers, with lesson plans and certificates.
        </p>
        <p className="mt-[1.6mm] font-bold">Ask us for the pricing sheet. It sets out every kit and the training.</p>
      </div>

      {/* 11 contact: the solid block on the outside */}
      <div className="absolute bg-graphite text-paper" style={at(10, 240, 188, 45.8)}>
        <div className="absolute left-[5mm] top-[6.5mm]">
          <Wordmark white mm={40} />
        </div>
        <p className="absolute bottom-[4.6mm] left-[5mm] font-mono text-[6.5pt] uppercase leading-none tracking-[0.15em] text-paper/75">Images are illustrative.</p>

        <div className="absolute" style={at(58, 6.5, 92, 35)} data-fit="back-contact">
          <Tag n="11" light>
            Fix a meeting
          </Tag>
          <p className="mt-[2.6mm] text-[13pt] font-bold leading-[1.12] tracking-[-0.02em]">{info.contactName ? `Ask for ${info.contactName}.` : "Ask us for a date."}</p>
          <dl className="mt-[2.4mm] grid grid-cols-[11mm_1fr] gap-y-[1.3mm] font-mono text-[8.6pt] leading-none">
            {contact.map((r) => (
              <div key={r.k} className="contents">
                <dt className="self-center text-[6.5pt] uppercase tracking-[0.15em] text-paper/70">{r.k}</dt>
                <dd className="break-all">{r.v}</dd>
              </div>
            ))}
          </dl>
          {contact.length < 3 && <p className="mt-[2.4mm] text-[8.4pt] leading-[1.36] text-paper/85">Scan the code to send us a message. We will call you back.</p>}
        </div>

        <div className="absolute right-[5mm] top-[5.6mm] flex flex-col items-center">
          <span className="grid size-[29mm] place-items-center bg-white">
            <Qr src={qrSrc} mm={23} label={`QR code: ${info.link("/contact")}`} />
          </span>
          <p className="mt-[1.6mm] font-mono text-[6.5pt] uppercase leading-none tracking-[0.13em] text-paper/80">Scan to write to us</p>
        </div>
      </div>
    </>
  );
}

/* ───────────────────────────── INSIDE · shared geometry ───────────────────────────── */

const CARD_Y = 90; // top of the four figures
const IMG_H = 62;
const CARD_H = 89;
const BAND_Y = 182; // the rule above the bottom band; the Media Pack block hangs from it
const TEXT_Y = 186;
const TEXT_H = 95;

const SPEC: { k: string; v: string }[] = [
  { k: "Grades", v: `${GRADE_MIN} to ${GRADE_MAX}, in ${gradeBands.length} grade groups` },
  { k: "Kits", v: `${kits.length}, one for each grade group` },
  { k: "One kit for", v: `a team of ${TEAM_SIZE} students` },
  { k: "Lessons", v: `${lasts(SESSION_MIN)} to ${lasts(SESSION_MAX)}` },
  { k: "Teacher training", v: `${teacherTraining.hours} hours, on campus` },
];

function BandCard({ id, i, x }: { id: GradeBandId; i: number; x: number }) {
  const b = band(id);
  const kit = kits.find((k) => k.id === b.kitId);
  return (
    <article className="absolute" style={at(x, CARD_Y, 88, CARD_H)} data-fit={`band-${i + 1}`}>
      <div aria-hidden className="relative" style={{ height: mm(IMG_H) }}>
        <Drawing src={b.image} />
        <Corners />
      </div>
      <p className="absolute left-[1mm] top-[1mm] bg-paper px-[0.6mm] py-[0.6mm] font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal">Fig. {i + 1} · illustration</p>
      <div className="mt-[3mm] flex items-center gap-[2mm] font-mono text-[7.4pt] font-medium uppercase leading-none tracking-[0.13em]">
        <Callout n={i + 1} />
        <span>{b.grades}</span>
        <span aria-hidden className="h-[0.22mm] flex-1 bg-graphite/50" />
        <span>{kit ? `${formatINR(kit.schoolPrice)} a kit` : lasts(b.durationMin)}</span>
      </div>
      <div className="mt-[2.2mm] flex items-baseline gap-[2.6mm]">
        <h3 className="shrink-0 text-[14.5pt] font-bold leading-none tracking-[-0.025em]">{b.name}</h3>
        <p className="whitespace-nowrap text-[8.8pt] italic leading-none text-charcoal">{b.theme}</p>
      </div>
      {kit && (
        <p className="mt-[2mm] border-t-[0.22mm] border-dashed border-graphite/55 pt-[1.5mm] text-[8.8pt] leading-[1.3]">
          <span className="font-bold">Students build:</span> {plain(kit.project)}
        </p>
      )}
    </article>
  );
}

/* ───────────────────────────── INSIDE · left half ───────────────────────────── */

function InsideLeft() {
  return (
    <>
      {/* 01 kits + teacher training */}
      <Tag n="01" className="absolute left-[15mm] top-[16mm]">
        Kits + teacher training
      </Tag>
      <Folio n={2} className="right-[12mm]" />
      <h2 className="absolute text-[25pt] font-bold leading-[1.02] tracking-[-0.03em]" style={at(15, 24.5, 183)}>
        <span className="block">Kits in every class.</span>
        <span className="block">Teachers who can teach them.</span>
      </h2>
      <p className="absolute text-[9.5pt] leading-[1.45]" style={at(15, 46, 88, 32)} data-fit="in-intro">
        We supply Robotics and AI kits in class sets, one kind for each grade group, with a lesson plan for every project. Then we train your teachers on your campus: every teacher builds every project, learns to run it in class and earns a JOVE certificate.
      </p>
      <div className="absolute border-[0.25mm] border-graphite bg-white" style={at(110, 46.6, 88, 31.4)} data-fit="in-spec">
        <p className="flex h-[4.9mm] items-center border-b-[0.25mm] border-graphite px-[2.4mm] font-mono text-[6.5pt] uppercase leading-none tracking-[0.17em] text-charcoal">At a glance</p>
        <dl>
          {SPEC.map((r, i) => (
            <div key={r.k} className={cn("flex h-[5.2mm] items-center justify-between gap-[2mm] px-[2.4mm]", i > 0 && "border-t-[0.2mm] border-graphite/30")}>
              <dt className="text-[8.2pt] leading-none">{r.k}</dt>
              <dd className="font-mono text-[7.8pt] font-medium leading-none">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 03 the four sessions (figures 1 and 2; 3 and 4 are on the right half) */}
      <Tag n="03" className="absolute left-[15mm] top-[82.6mm]">
        A kit for each grade group
      </Tag>
      <BandCard id="g1-2" i={0} x={15} />
      <BandCard id="g3-5" i={1} x={110} />

      {/* 04 for your students */}
      <div className="absolute flex flex-col" style={at(15, TEXT_Y, 88, TEXT_H)} data-fit="in-students">
        <Tag n="04">For your students</Tag>
        <h3 className="mt-[2.6mm] text-[14pt] font-bold leading-[1.05] tracking-[-0.025em]">How it helps your students</h3>
        <ul className="mt-[3.4mm] flex flex-1 flex-col justify-between">
          <Point title="They build and test something real">
            Teams of {TEAM_SIZE} share a real kit. Before the lesson ends, their robot lights up, moves or sees.
          </Point>
          <Point title="Real circuits, sensors and code">
            {band("g3-5").grades} wire a breadboard and write block code. {band("g6-8").grades} wire sensors to an Arduino and program it.
          </Point>
          <Point title="They train a machine-learning model">
            {band("g6-8").grades} train an image or sound model and test it live. {band("g9-10").grades} link a vision model to a robot.
          </Point>
          <Point title="They work in teams and present">
            Teams show and explain what they built. {band("g9-10").grades} also debate responsible AI and pitch an idea.
          </Point>
          <Point title="They can practise at home">The free 3D bench has the same parts as the kits, so students build again from home.</Point>
        </ul>
      </div>

      {/* 05 for your school */}
      <div className="absolute flex flex-col" style={at(110, TEXT_Y, 88, TEXT_H)} data-fit="in-school">
        <Tag n="05">For your school</Tag>
        <h3 className="mt-[2.6mm] text-[14pt] font-bold leading-[1.05] tracking-[-0.025em]">How it helps your school</h3>
        <ul className="mt-[3.4mm] flex flex-1 flex-col justify-between">
          <Point title="Your teachers, trained and certified">{`${teacherTraining.hours} hands-on hours on campus, then a JOVE certificate for every teacher who completes it.`}</Point>
          <Point title="Lesson plans for every project">Step by step, with the questions to ask and the usual faults to fix. No lab needed: a classroom with tables and power.</Point>
          <Point title="It supports your syllabus">
            The lessons support CBSE, ICSE and State Board science and computer-science outcomes, NEP 2020&apos;s emphasis on experiential learning and coding, and the Atal Tinkering Lab framework.
          </Point>
          <Point title="Safe by design">
            Trainers are background-verified and trained on our safety SOP and child-protection policy. Kits are <span className="whitespace-nowrap">low-voltage</span> and child-safe.
          </Point>
          {/* the fifth point is the block across the fold: a leader line points to it */}
          <li className="flex items-center gap-[2mm] pl-[5mm] font-mono text-[6.8pt] font-medium uppercase leading-none tracking-[0.15em]">
            <span>And the training on film: see 06</span>
            <span aria-hidden className="h-[0.22mm] flex-1 bg-graphite" />
          </li>
        </ul>
      </div>
    </>
  );
}

/* ───────────────────────────── INSIDE · right half ───────────────────────────── */

/** The teacher training, from the price book: what every teacher does and takes away. */
function TrainingPlan() {
  return (
    <ol className="absolute grid grid-cols-2 gap-x-[6mm] gap-y-[2.2mm]" style={at(12, 24.5, 183, 40)} data-fit="in-training">
      {teacherTraining.includes.map((x, i) => (
        <li key={x} className="flex gap-[2.4mm]">
          <Callout n={i + 1} size={5} />
          <p className="text-[8.8pt] leading-[1.32]">{plain(x)}</p>
        </li>
      ))}
    </ol>
  );
}

function InsideRight() {
  return (
    <>
      {/* 02 the teacher training */}
      <Tag n="02" className="absolute left-[12mm] top-[16mm]">
        {teacherTraining.name}
      </Tag>
      <Folio n={3} className="right-[15mm]" />
      <TrainingPlan />
      <p className="absolute text-[8.6pt] leading-[1.4]" style={at(12, 66.2, 183, 13)} data-fit="in-timetable-note">
        <span className="font-bold">{teacherTraining.hours} hours on your campus, from {teacherTraining.minimumTeachers} teachers.</span> The kits reach you first, so your teachers train on the boxes they will use in class. We fix the date with your coordinator, and a JOVE trainer and the film crew
        come to you.
      </p>

      {/* 03 figures 3 and 4 */}
      <BandCard id="g6-8" i={2} x={12} />
      <BandCard id="g9-10" i={3} x={107} />

      {/* 06 the Media Pack: the solid block on the inside, in the corner of the frame */}
      <div className="absolute bg-graphite text-paper" style={at(12, BAND_Y, 188, 285.8 - BAND_Y)}>
        <div className="absolute" style={at(6, 7, 66, 70)} data-fit="in-media-lead">
          <Tag n="06" light>
            With Kits + Teacher Training
          </Tag>
          <h3 className="mt-[3.6mm] text-[23pt] font-bold leading-[1.02] tracking-[-0.03em]">
            <span className="block">Your training</span>
            <span className="block">day, on film.</span>
          </h3>
          <p className="mt-[3.2mm] text-[9pt] leading-[1.42] text-paper/90">
            {site.studio.name} is our own film studio. It films your teachers building and testing the projects, for your website and admissions.
          </p>
        </div>

        <ul className="absolute grid grid-cols-2 gap-x-[5mm]" style={at(80, 7, 103, 70)} data-fit="in-media-items">
          {trainingFilm.items.map((m, i) => {
            const Icon = filmIcon(m.title);
            return (
              <li key={m.title} className={cn("flex items-start gap-[2.6mm] pt-[3.4mm]", i > 1 && "border-t-[0.2mm] border-paper/30")}>
                <span className="grid size-[8.4mm] shrink-0 place-items-center rounded-full border-[0.25mm] border-paper/70">
                  <Icon className="size-[4.4mm]" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-balance text-[9.6pt] font-bold leading-[1.16] tracking-[-0.01em]">{m.title}</p>
                  <p className="mt-[1.3mm] text-[8.4pt] leading-[1.36] text-paper/80">{m.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="absolute border-t-[0.25mm] border-paper/40 pt-[2.6mm] text-[8.4pt] leading-[1.4] text-paper/90" style={at(6, 80.6, 177, 18)} data-fit="in-media-note">
          <span className="font-bold text-paper">We film only with the school&apos;s permission, and any teacher can ask to be left out.</span> {trainingFilm.rights}
        </p>
      </div>
    </>
  );
}

/* ───────────────────────────── the brochure ───────────────────────────── */

export function IntroBrochure({ q }: { q: Q }) {
  const info = useBrochureInfo(q);
  const qrSrc = useQr(info.link("/contact"));
  return (
    <BrochureShell
      title="Brochure: Meet JOVE"
      q={q}
      ready={info.ready && !!qrSrc}
      outside={
        <Spread className="bg-paper">
          <Ground />
          <Half side="left">
            <BackCover info={info} qrSrc={qrSrc} />
          </Half>
          <Half side="right">
            <FrontCover info={info} />
          </Half>
        </Spread>
      }
      inside={
        <Spread className="bg-paper">
          <Ground />
          {/* lines that run across the fold: the dimension line over the four figures, the rule above the bottom band, the leader to panel 06 */}
          <div className="absolute" style={at(110, 83.3, 295)}>
            <Dim />
          </div>
          <p className="absolute bg-paper px-[2.2mm] font-mono text-[6.8pt] font-medium uppercase leading-none tracking-[0.17em]" style={{ left: "255mm", top: "83.7mm" }}>
            Grades {GRADE_MIN} to {GRADE_MAX} · school price per kit
          </p>
          <span aria-hidden className="absolute h-[0.3mm] bg-graphite" style={at(15, BAND_Y, 207)} />
          <span aria-hidden className="absolute h-[0.22mm] bg-graphite" style={at(198, TEXT_Y + TEXT_H - 1.31, 22.4)} />
          <span aria-hidden className="absolute size-0 border-y-[0.65mm] border-l-[2mm] border-y-transparent border-l-graphite" style={{ left: "220mm", top: mm(TEXT_Y + TEXT_H - 1.85) }} />
          <Half side="left">
            <InsideLeft />
          </Half>
          <Half side="right">
            <InsideRight />
          </Half>
        </Spread>
      }
    />
  );
}
